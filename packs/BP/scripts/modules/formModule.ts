import {
  BlockPermutation,
  system,
  world,
  Player,
  ItemUseAfterEvent,
  Vector3,
  EntityInventoryComponent,
  ItemStack,
  RawText,
} from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import ScriptingModule from "./scriptingModule";
import {
  AchievementForm,
  ActionForm,
  ModalForm,
  UnlockByItemOptions,
} from "./class/form";
import { forms } from "../config/form/_index"; // Import forms configuration
import {
  addItemToInventory,
  decreaseItemAmountInHand,
  removeItemFromInventory,
  sendNotification,
} from "./helper/utils";
import { namespace } from "../config/_config";
import { GlobalIntervals } from "./helper/globalIntervals";

type FormType = ActionForm | ModalForm;

const UNLOCKED_FORMS_PROPERTY = `${namespace}:unlockedForms`;
const VISIBLE_FORMS_PROPERTY = `${namespace}:visibleForms`;

interface ItemUseOption {
  id: string;
  count: number;
  removeItem?: boolean;
}

export default class FormModule extends ScriptingModule {
  private actionForms: Map<string, ActionForm> = new Map();
  private modalForms: Map<string, ModalForm> = new Map();
  private triggers: Map<string, string[]> = new Map();
  private references: Map<string, string[]> = new Map();
  private navigationStack: string[] = [];
  private mainForms: Map<string, string> = new Map();
  private currentFormOpenedViaInteraction: boolean = false;
  // Add these arrays at the top of FormModule to store forms by triggers
  private entityKillForms: { form: ActionForm; entityTypes: string[] }[] = [];
  private blockBreakForms: { form: ActionForm; blockTypes: string[] }[] = [];
  private blockPlaceForms: { form: ActionForm; blockTypes: string[] }[] = [];
  private blockInteractForms: { form: ActionForm; blockTypes: string[] }[] = [];
  private entityInteractForms: { form: ActionForm; entityTypes: string[] }[] =
    [];
  private useItemForms: { form: ActionForm; items: ItemUseOption[] }[] = [];
  private restartingForms: Map<string, Set<string>> = new Map(); // New field to track restarting forms

  constructor() {
    super("FormModule");
    this.registerForms(); // Register forms immediately upon instantiation
  }

  public onInitialize(): void {
    world.afterEvents.itemUse.subscribe(this.handleItemUse);

    // Check for inventory-based form unlock more frequently
    GlobalIntervals.set(() => {
      world.getPlayers().forEach((player) => {
        this.triggerFormFromInventory(player);
        this.checkFormVisibility(player); // Add visibility checks
      });
    }, 5);

    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (event.id == `${namespace}:reset_forms`) {
        const properties = world.getDynamicPropertyIds();
        for (const key of properties) {
          // Reset global unlocked forms properties
          if (key.startsWith(UNLOCKED_FORMS_PROPERTY)) {
            world.setDynamicProperty(key, false);
          }
        }

        world.getPlayers().forEach((player) => {
          const properties = player.getDynamicPropertyIds();
          for (const key of properties) {
            // Reset both unlocked forms and restarted flags so every player starts fresh.
            if (
              key.startsWith(UNLOCKED_FORMS_PROPERTY) ||
              key.startsWith(`${namespace}:restarted:`) ||
              key.startsWith(VISIBLE_FORMS_PROPERTY)
            ) {
              player.setDynamicProperty(key, false);
            }
          }
        });
      }

      // Handle scriptEvent triggers
      this.handleScriptEventTrigger(event.id, event.message);
    });

    this.registerActionBasedEvents();
  }

  private handleItemUse = (event: ItemUseAfterEvent) => {
    const player = event.source;
    const itemTypeId = event.itemStack.typeId;

    // First check ordered useItem triggers - Changed sort order to ascending
    const orderedForms = this.useItemForms
      .filter(({ form }) => form.options.unlock?.order !== undefined)
      .sort(
        (a, b) =>
          (a.form.options.unlock?.order || 0) -
          (b.form.options.unlock?.order || 0)
      ); // Changed sort order here

    if (orderedForms.length > 0) {
      // Find first unfinished achievement
      for (const { form, items } of orderedForms) {
        const scope =
          form.options.unlock?.property === "world" ? "world" : "player";
        const unlockedForms =
          scope === "world"
            ? getWorldUnlockedForms()
            : getPlayerUnlockedForms(player);

        if (!unlockedForms.has(form.id)) {
          // Check if this form should be triggered by this item
          const matchingItem = items.find((item) => item.id === itemTypeId);

          if (matchingItem) {
            // New: Remove the item using removeItemFromInventory if removeItem true
            if (matchingItem.removeItem) {
              removeItemFromInventory(player, itemTypeId);
            }
            this.unlockFormForTrigger(form, player);
            return; // Only unlock one achievement at a time
          }
        }
      }
    }

    // Then handle regular item interactions
    if (this.triggers.has(itemTypeId)) {
      const entitiesHit = player.getEntitiesFromViewDirection({
        maxDistance: 6,
      });
      for (const hit of entitiesHit) {
        const form = this.getInteractionForEntity(
          hit.entity.typeId,
          itemTypeId
        );
        if (form) {
          this.showForm(player, form.id, false, true);
          return;
        }
      }

      const blockHit = player.getBlockFromViewDirection({ maxDistance: 6 });
      if (blockHit) {
        const form = this.getInteractionForBlock(
          blockHit.block.typeId,
          itemTypeId
        );
        if (form) {
          this.showForm(player, form.id, false, true);
          return;
        }
      }

      const formIds = this.triggers.get(itemTypeId);
      if (formIds && formIds.length > 0) {
        const mainFormId = this.mainForms.get(itemTypeId);
        if (mainFormId) {
          this.showForm(player, mainFormId, true);
        } else if (formIds.length === 1) {
          this.showForm(player, formIds[0], true);
        } else {
          this.showFormSelector(player, formIds, true);
        }
      }
    }
  };

  private handleScriptEventTrigger(eventId: string, message: string): void {
    this.actionForms.forEach((form) => {
      const unlock = form.options.unlock;
      if (unlock?.trigger.scriptEvent) {
        const { id, message: expectedMessage } = unlock.trigger.scriptEvent;
        if (
          id === eventId &&
          (!expectedMessage || expectedMessage === message)
        ) {
          const scope = unlock.property === "world" ? "world" : "player";
          world.getPlayers().forEach((player) => {
            let unlockedForms: Set<string> =
              scope === "world"
                ? getWorldUnlockedForms()
                : getPlayerUnlockedForms(player);

            if (!unlockedForms.has(form.id)) {
              unlockedForms.add(form.id);
              if (scope === "world") {
                setWorldUnlockedForms(unlockedForms);
              } else {
                setPlayerUnlockedForms(player, unlockedForms);
              }

              // Play sound if defined
              if (unlock.sound) {
                player.playSound(unlock.sound);
              }

              // Trigger messages
              if (unlock.messages) {
                this.triggerMessages(unlock.messages, player);
              }

              // Handle rewards
              const reward = unlock.reward;
              if (scope === "world") {
                setWorldUnlockedForms(unlockedForms);

                const allPlayers = world.getAllPlayers();
                if (reward) {
                  if (typeof reward.xp === "number" && reward.xp > 0) {
                    for (const p of allPlayers) {
                      p.addLevels(reward.xp);
                    }
                  }
                  if (reward.items && Array.isArray(reward.items)) {
                    for (const p of allPlayers) {
                      for (const rewardedItem of reward.items) {
                        addItemToInventory(
                          p,
                          new ItemStack(rewardedItem.id, rewardedItem.count)
                        );
                      }
                    }
                  }
                }
              } else {
                if (reward) {
                  if (typeof reward.xp === "number" && reward.xp > 0) {
                    player.addLevels(reward.xp);
                  }
                  if (reward.items && Array.isArray(reward.items)) {
                    for (const rewardedItem of reward.items) {
                      addItemToInventory(
                        player,
                        new ItemStack(rewardedItem.id, rewardedItem.count)
                      );
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }

  private getInteractionForEntity(
    typeId: string,
    itemTypeId: string
  ): FormType | null {
    for (const form of this.actionForms.values()) {
      if (form.options.interact?.entities?.includes(typeId)) {
        return form;
      }
    }
    for (const form of this.modalForms.values()) {
      if (form.options.interact?.entities?.includes(typeId)) {
        return form;
      }
    }
    return null;
  }

  private getUnlockedForms(): Set<string> {
    const unlockedFormsString =
      (world.getDynamicProperty(UNLOCKED_FORMS_PROPERTY) as string) || "[]";
    return new Set(JSON.parse(unlockedFormsString));
  }

  private setUnlockedForms(unlockedForms: Set<string>): void {
    world.setDynamicProperty(
      UNLOCKED_FORMS_PROPERTY,
      JSON.stringify(Array.from(unlockedForms))
    );
  }

  private triggerMessages(
    messages: {
      text: string;
      target: "chat" | "title" | "actionbar" | "toast";
      private: boolean;
      toastTitle?: string;
      toastTexture?: string;
    }[],
    player: Player
  ) {
    messages.forEach((message) => {
      if (message.target === "chat") {
        if (message.private) {
          player.sendMessage({ translate: message.text, with: [player.name] });
        } else {
          world.sendMessage({ translate: message.text, with: [player.name] });
        }
      } else if (message.target === "actionbar") {
        if (message.private) {
          player.onScreenDisplay.setActionBar({
            translate: message.text,
            with: [player.name],
          });
        } else {
          world.getAllPlayers().forEach((p) => {
            p.onScreenDisplay.setActionBar({
              translate: message.text,
              with: [player.name],
            });
          });
        }
      } else if (message.target === "title") {
        if (message.private) {
          player.onScreenDisplay.setTitle({
            translate: message.text,
            with: [player.name],
          });
        } else {
          world.getAllPlayers().forEach((p) => {
            p.onScreenDisplay.setTitle({
              translate: message.text,
              with: [player.name],
            });
          });
        }
      } else if (message.target === "toast") {
        let noti: (RawText | string)[] = [
          message.toastTitle
            ? { rawtext: [{ translate: message.toastTitle }, { text: "\n§r" }] }
            : "",
          { rawtext: [{ translate: message.text }] },
        ];
        if (message.private) {
          sendNotification(
            player,
            noti,
            message.toastTexture ? message.toastTexture : ""
          );
        }
      }
    });
  }

  private playerHasItemGroup(
    player: Player,
    itemGroup: UnlockByItemOptions[]
  ): boolean {
    const inventory = player.getComponent(
      "inventory"
    ) as EntityInventoryComponent;
    const container = inventory.container!;

    return itemGroup.every((requiredItem) => {
      let foundCount = 0;
      for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (item && item.typeId === requiredItem.id) {
          foundCount += item.amount;
          if (foundCount >= (requiredItem.count || 1)) {
            return true;
          }
        }
      }
      return false;
    });
  }

  private checkFormUnlock(player: Player, itemTypeId: string): void {
    for (const form of this.actionForms.values()) {
      const unlock = form.options.unlock;
      if (!unlock) continue;

      // Check if only unlock when visible
      if (
        unlock.onlyUnlockWhenVisible &&
        form instanceof AchievementForm &&
        form.achievementOptions.show
      ) {
        // Check if this achievement form is currently visible
        const visibleScope =
          form.achievementOptions.show.property === "world"
            ? "world"
            : "player";
        const visibleForms =
          visibleScope === "world"
            ? getWorldVisibleForms()
            : getPlayerVisibleForms(player);
        if (!visibleForms.has(form.id)) {
          continue; // Skip this form if it's not visible yet
        }
      }

      // Check itemID-based triggers
      const matchesItemID =
        "itemID" in unlock.trigger && unlock.trigger.itemID === itemTypeId;

      const scope = unlock.property === "world" ? "world" : "player";
      const unlockedForms =
        scope === "world"
          ? getWorldUnlockedForms()
          : getPlayerUnlockedForms(player);

      // Check hasItem-based triggers - succeeds if any item group (array) is fully satisfied
      const matchesHasItem = unlock.trigger.hasItem?.some((itemGroup) => {
        const hasAllItems = this.playerHasItemGroup(player, itemGroup);

        // If we match and have the items, immediately handle item removal here
        // This ensures items are removed as soon as they match, not later
        if (hasAllItems && !unlockedForms.has(form.id)) {
          itemGroup.forEach((item) => {
            if (item.removeItem === true) {
              // Remove the items immediately upon matching
              for (let i = 0; i < (item.count || 1); i++) {
                removeItemFromInventory(player, item.id);
              }
            }
          });
        }

        return hasAllItems;
      });

      // Check achievement-based triggers
      const matchesAchievement = unlock.trigger.achievement?.some(
        (achievementId) => {
          const scope = unlock.property === "world" ? "world" : "player";
          const unlockedForms =
            scope === "world"
              ? getWorldUnlockedForms()
              : getPlayerUnlockedForms(player);
          return unlockedForms.has(achievementId);
        }
      );

      if (matchesItemID || matchesHasItem || matchesAchievement) {
        if (!unlockedForms.has(form.id)) {
          // ...existing code continues...
          if (
            unlock.onlyUnlockWhenVisible &&
            form instanceof AchievementForm &&
            form.achievementOptions.show
          ) {
            // Check if this achievement form is currently visible
            const visibleScope =
              form.achievementOptions.show.property === "world"
                ? "world"
                : "player";
            const visibleForms =
              visibleScope === "world"
                ? getWorldVisibleForms()
                : getPlayerVisibleForms(player);
            if (!visibleForms.has(form.id)) {
              continue; // Skip this form if it's not visible yet
            }
          }

          unlockedForms.add(form.id);

          if (scope === "world") {
            setWorldUnlockedForms(unlockedForms);
          } else {
            setPlayerUnlockedForms(player, unlockedForms);
          }

          // Play sound if defined
          if (unlock.sound) {
            player.playSound(unlock.sound);
          }

          // Trigger messages
          if (unlock.messages) {
            this.triggerMessages(unlock.messages, player);
          }

          // Remove the item removal code from here since we've already handled it above
          // This prevents trying to remove items that may no longer exist in inventory

          // Handle rewards
          const reward = unlock.reward;
          if (scope === "world") {
            setWorldUnlockedForms(unlockedForms);
            const allPlayers = world.getAllPlayers();
            if (reward) {
              if (typeof reward.xp === "number" && reward.xp > 0) {
                for (const p of allPlayers) {
                  p.addLevels(reward.xp);
                }
              }
              if (reward.items && Array.isArray(reward.items)) {
                for (const p of allPlayers) {
                  for (const rewardedItem of reward.items) {
                    addItemToInventory(
                      p,
                      new ItemStack(rewardedItem.id, rewardedItem.count)
                    );
                  }
                }
              }
            }
          } else {
            if (reward) {
              if (typeof reward.xp === "number" && reward.xp > 0) {
                player.addLevels(reward.xp);
              }
              if (reward.items && Array.isArray(reward.items)) {
                for (const rewardedItem of reward.items) {
                  addItemToInventory(
                    player,
                    new ItemStack(rewardedItem.id, rewardedItem.count)
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  private triggerFormFromInventory(player: Player): void {
    // Get only forms with hasItem triggers to avoid unnecessary checks
    const formsWithInventoryTriggers = Array.from(
      this.actionForms.values()
    ).filter((form) => form.options.unlock?.trigger.hasItem);

    // Check all the forms with inventory triggers at once
    for (const form of formsWithInventoryTriggers) {
      const unlock = form.options.unlock;
      if (!unlock) continue;

      // Skip already unlocked forms
      const scope = unlock.property === "world" ? "world" : "player";
      let unlockedForms =
        scope === "world"
          ? getWorldUnlockedForms()
          : getPlayerUnlockedForms(player);
      if (unlockedForms.has(form.id)) continue;

      // First check if parent visibility requirements are met
      if (
        unlock.onlyUnlockWhenVisible &&
        form instanceof AchievementForm &&
        form.achievementOptions.show
      ) {
        // Check if this achievement form is currently visible
        const visibleScope =
          form.achievementOptions.show.property === "world"
            ? "world"
            : "player";
        const visibleForms =
          visibleScope === "world"
            ? getWorldVisibleForms()
            : getPlayerVisibleForms(player);
        if (!visibleForms.has(form.id)) {
          continue; // Skip this form since it's not visible yet
        }
      }

      // Now check if inventory requirements are met
      let matchedGroup: UnlockByItemOptions[] | undefined;
      const matchesHasItem = unlock.trigger.hasItem?.some((itemGroup) => {
        const hasAllItems = this.playerHasItemGroup(player, itemGroup);
        if (hasAllItems) {
          matchedGroup = itemGroup;
          return true;
        }
        return false;
      });

      // Only if all conditions are met, proceed to remove items and unlock
      if (matchesHasItem && matchedGroup) {
        // Remove items marked for removal BEFORE unlocking the form
        matchedGroup.forEach((item) => {
          if (item.removeItem === true) {
            for (let i = 0; i < (item.count || 1); i++) {
              const ignoreInCreative = false;
              removeItemFromInventory(player, item.id, 1, ignoreInCreative);
            }
          }
        });

        // Unlock the form after removing items
        this.unlockFormForTrigger(form, player);

        // Limit how many forms we process at once
        if (formsWithInventoryTriggers.indexOf(form) >= 3) {
          break;
        }
      }
    }
  }

  private checkFormVisibility(player: Player): void {
    // Get only AchievementForms with show triggers
    const formsWithShowTriggers = Array.from(this.actionForms.values()).filter(
      (form) => form instanceof AchievementForm && form.achievementOptions.show
    ) as AchievementForm[];

    for (const form of formsWithShowTriggers) {
      const show = form.achievementOptions.show!;
      const scope = show.property === "world" ? "world" : "player";
      let visibleForms =
        scope === "world"
          ? getWorldVisibleForms()
          : getPlayerVisibleForms(player);

      if (visibleForms.has(form.id)) continue; // Already visible

      // Check visibility conditions
      let shouldShow = false;

      // Check hasItem triggers
      if (show.trigger.hasItem) {
        shouldShow = show.trigger.hasItem.some((itemGroup) =>
          this.playerHasItemGroup(player, itemGroup)
        );
      }

      // Check achievement triggers
      if (show.trigger.achievement) {
        const unlockedForms =
          scope === "world"
            ? getWorldUnlockedForms()
            : getPlayerUnlockedForms(player);
        shouldShow = show.trigger.achievement.some((achievementId) =>
          unlockedForms.has(achievementId)
        );
      }

      // Check scriptEvent triggers (handled in handleScriptEventTrigger)
      // Check entityKill triggers (handled in registerActionBasedEvents)
      // Check other triggers as needed

      if (shouldShow) {
        visibleForms.add(form.id);
        if (scope === "world") {
          setWorldVisibleForms(visibleForms);
        } else {
          setPlayerVisibleForms(player, visibleForms);
        }

        // Play sound if defined
        if (show.sound) {
          player.playSound(show.sound);
        }

        // Trigger messages
        if (show.messages) {
          this.triggerMessages(show.messages, player);
        }
      }
    }
  }

  private getInteractionForBlock(
    typeId: string,
    itemTypeId: string
  ): FormType | null {
    for (const form of this.actionForms.values()) {
      if (form.options.interact?.blocks?.includes(typeId)) {
        return form;
      }
    }
    for (const form of this.modalForms.values()) {
      if (form.options.interact?.blocks?.includes(typeId)) {
        return form;
      }
    }
    return null;
  }

  private async showFormSelector(
    player: Player,
    formIds: string[],
    isMain: boolean = false
  ): Promise<void> {
    if (isMain) {
      this.navigationStack = [];
    }
    const selector = new ActionFormData()
      .title("Select a guide")
      .body("Choose a guide to view:");

    formIds.forEach((id) => {
      const form = this.actionForms.get(id) || this.modalForms.get(id);
      if (form) {
        const title =
          form instanceof ActionForm
            ? form.getTitle()
            : { text: form.getTitle() };
        const iconPath = form.options.iconPath || "";
        selector.button(title, iconPath);
      }
    });

    const response = await selector.show(player);
    if (!response.canceled && response.selection !== undefined) {
      this.showForm(player, formIds[response.selection], false);
    }
  }

  public async showForm(
    player: Player,
    formId: string,
    isMain: boolean = false,
    isInteraction: boolean = false
  ): Promise<void> {
    const form = this.actionForms.get(formId) || this.modalForms.get(formId);
    if (!form) {
      return;
    }
    player.runCommand("/stopsound @s random.click");
    player.playSound("item.book.page_turn");

    if (isMain) {
      this.navigationStack = [];
    }
    this.navigationStack.push(formId);
    this.currentFormOpenedViaInteraction = isInteraction;

    const unlockProperty =
      form.options.unlock?.property === "world" ? "world" : "player";
    const unlockedForms =
      unlockProperty === "world"
        ? getWorldUnlockedForms()
        : getPlayerUnlockedForms(player);

    // Get visible forms for achievements
    const visibleProperty =
      form instanceof AchievementForm &&
      form.achievementOptions.show?.property === "world"
        ? "world"
        : "player";
    const visibleForms =
      visibleProperty === "world"
        ? getWorldVisibleForms()
        : getPlayerVisibleForms(player);

    if (form instanceof ActionForm) {
      const {
        form: compiledForm,
        buttonCount,
        backButtonIndex,
        restartButtonIndex,
      } = form.compile(
        player,
        new Map<string, ActionForm | ModalForm>([
          ...this.actionForms,
          ...this.modalForms,
        ]),
        this.references,
        unlockedForms,
        visibleForms
      );
      const response = await compiledForm.show(player);

      if (response.canceled || response.selection === undefined) {
        return;
      }

      // Check for restart button click.
      if (
        restartButtonIndex !== undefined &&
        response.selection === restartButtonIndex
      ) {
        this.restartAchievement(player, form);
        return;
      }

      if (
        backButtonIndex !== undefined &&
        response.selection === backButtonIndex
      ) {
        this.handleBackNavigation(player);
        return;
      }

      // Get the same filtered list that the compile method uses
      const allReferencedForms = this.references.get(formId) || [];
      const visibleReferencedForms = allReferencedForms.filter((refId) => {
        const refForm =
          this.actionForms.get(refId) || this.modalForms.get(refId);
        if (!refForm) return false;

        // Check if form is unlocked (same logic as compile method)
        const refUnlockProperty =
          refForm.options.unlock?.property === "world" ? "world" : "player";
        const refUnlockedForms =
          refUnlockProperty === "world"
            ? getWorldUnlockedForms()
            : getPlayerUnlockedForms(player);

        // For AchievementForms, check visibility
        if (refForm instanceof AchievementForm) {
          // If no show property is defined, the form should be visible by default
          if (!refForm.achievementOptions.show) {
            return true;
          }

          const refVisibleProperty =
            refForm.achievementOptions.show.property === "world"
              ? "world"
              : "player";
          const refVisibleForms =
            refVisibleProperty === "world"
              ? getWorldVisibleForms()
              : getPlayerVisibleForms(player);
          return refVisibleForms.has(refId);
        }

        // For other forms, check unlock status or if no unlock requirements
        return !refForm.options.unlock || refUnlockedForms.has(refId);
      });

      if (response.selection < visibleReferencedForms.length) {
        const selectedReference = visibleReferencedForms[response.selection];

        if (
          this.actionForms.has(selectedReference) ||
          this.modalForms.has(selectedReference)
        ) {
          this.showForm(player, selectedReference);
          return;
        }
      }
    } else if (form instanceof ModalForm) {
      const compiledForm = form.compile();
      const response = await compiledForm.show(player);

      if (response.canceled) {
        const referencedForms = form.options.references || [];
        if (referencedForms.length > 0) {
          this.showForm(player, referencedForms[0]);
        }
        return;
      } else if (response.formValues) {
        console.log("ModalForm response:", response.formValues);

        form.options.controls.forEach((control, index) => {
          if (control.dynamicProperty && response.formValues) {
            const value = response.formValues[index];
            // Only set the dynamic property if the value is not undefined
            if (value !== undefined) {
              this.setDynamicProperty(control.dynamicProperty, value);
            }
          }
        });
      }
    }
  }

  // New method to handle restart action for an achievement.
  private restartAchievement(player: Player, form: ActionForm): void {
    const unlock = form.options.unlock;
    if (!unlock || !unlock.restart) return;

    // Check if player can afford the restart cost
    if (unlock.restart.cost) {
      const cost = unlock.restart.cost;

      // Check XP cost
      if (typeof cost.xp === "number" && cost.xp > 0) {
        if (player.level < cost.xp) {
          player.sendMessage({
            translate: `${namespace}.achievement.restart.insufficient_xp`,
          });
          return;
        }
      }

      // Check item costs
      if (cost.items && cost.items.length > 0) {
        const inventory = player.getComponent(
          "inventory"
        ) as EntityInventoryComponent;
        const container = inventory.container!;

        for (const requiredItem of cost.items) {
          let foundCount = 0;
          for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item && item.typeId === requiredItem.id) {
              foundCount += item.amount;
            }
          }

          if (foundCount < requiredItem.count) {
            player.sendMessage({
              translate: `${namespace}.achievement.restart.insufficient_items`,
            });
            return;
          }
        }
      }

      // Deduct the costs
      if (typeof cost.xp === "number" && cost.xp > 0) {
        player.addLevels(-cost.xp);
      }

      if (cost.items && cost.items.length > 0) {
        for (const costItem of cost.items) {
          for (let i = 0; i < costItem.count; i++) {
            removeItemFromInventory(player, costItem.id);
          }
        }
      }
    }

    const scope = unlock.property === "world" ? "world" : "player";
    let unlockedForms =
      scope === "world"
        ? getWorldUnlockedForms()
        : getPlayerUnlockedForms(player);

    // Lock the form again.
    if (unlockedForms.has(form.id)) {
      unlockedForms.delete(form.id);
      if (scope === "world") {
        setWorldUnlockedForms(unlockedForms);
      } else {
        setPlayerUnlockedForms(player, unlockedForms);
      }
    }

    // Reset progress counters for this achievement
    if (unlock.trigger.entityKill) {
      // Reset single entity counter
      if (
        !Array.isArray(unlock.trigger.entityKill) &&
        "entities" in unlock.trigger.entityKill
      ) {
        const progressKey = `${namespace}:progress:${form.id}`;
        player.setDynamicProperty(progressKey, 0);
      }
      // Reset multiple entity counters
      else if (Array.isArray(unlock.trigger.entityKill)) {
        const firstItem = unlock.trigger.entityKill[0];
        if (typeof firstItem === "object" && "entity" in firstItem) {
          for (const req of unlock.trigger.entityKill as {
            entity: string;
            count: number;
          }[]) {
            const progressKey = `${namespace}:progress:${form.id}:${req.entity}`;
            player.setDynamicProperty(progressKey, 0);
          }
        }
      }
    }

    // Reset hasItem progress if needed
    // Note: For hasItem, we don't need to reset counters as we check inventory directly

    // Give start items to the player
    if (
      unlock.restart.startItems?.items &&
      unlock.restart.startItems.items.length > 0
    ) {
      for (const startItem of unlock.restart.startItems.items) {
        addItemToInventory(
          player,
          new ItemStack(startItem.id, startItem.count)
        );
      }
    }

    // Mark form as restarted by setting a dynamic property.
    player.setDynamicProperty(`${namespace}:restarted:${form.id}`, true);
    this.markFormAsRestarting(form.id, player);

    // Optionally, send a message or play a sound defined in restart.
    if (unlock.restart.sound) {
      player.playSound(unlock.restart.sound);
    }
    if (unlock.restart.message) {
      if (scope === "world") {
        world.sendMessage({
          translate: unlock.restart.message,
          with: [player.name],
        });
      } else {
        player.sendMessage({
          translate: unlock.restart.message,
          with: [player.name],
        });
      }
    }

    // Re-show the form to display the updated UI with restart reward.
    this.showForm(player, form.id);
  }

  // New helper to mark a form as restarting.
  private markFormAsRestarting(formId: string, player: Player): void {
    const playerId = player.id;
    if (!this.restartingForms.has(playerId)) {
      this.restartingForms.set(playerId, new Set());
    }
    this.restartingForms.get(playerId)!.add(formId);
    // Remove marker after 5 seconds (100 ticks)
    system.runTimeout(() => {
      const forms = this.restartingForms.get(playerId);
      if (forms && forms.has(formId)) {
        forms.delete(formId);
        if (forms.size === 0) {
          this.restartingForms.delete(playerId);
        }
      }
    }, 100);
  }

  private handleBackNavigation(player: Player) {
    player.runCommand("/stopsound @s random.click");

    if (this.currentFormOpenedViaInteraction) {
      const mainFormId = this.getMainFormIdForCurrentForm();
      if (mainFormId) {
        this.showForm(player, mainFormId, true);
      }
    } else if (this.navigationStack.length > 1) {
      this.navigationStack.pop();
      const previousPage = this.navigationStack.pop();
      if (previousPage) {
        this.showForm(player, previousPage);
      }
    } else {
      // Handle case where there's no previous page in the stack
    }
  }

  private getMainFormIdForCurrentForm(): string | undefined {
    const currentFormId = this.navigationStack[this.navigationStack.length - 1];
    for (const [trigger, mainFormId] of this.mainForms) {
      if (this.triggers.get(trigger)?.includes(currentFormId)) {
        return mainFormId;
      }
    }
    return undefined;
  }

  public registerForms(): void {
    forms.forEach(({ forms: formGroup, trigger, mainForm }) => {
      formGroup.forEach((formData: any) => {
        const isMainForm = formData.id === mainForm;
        let formInstance: FormType;

        if (formData instanceof AchievementForm) {
          formInstance = formData;
          this.actionForms.set(formInstance.id, formInstance);
        } else if (formData instanceof ActionForm) {
          formInstance = formData;
          this.actionForms.set(formInstance.id, formInstance);
        } else if (formData instanceof ModalForm) {
          formInstance = formData;
          this.modalForms.set(formInstance.id, formInstance);
        } else {
          throw new Error(`Unknown form type for form with id: ${formData.id}`);
        }

        if (isMainForm) {
          this.mainForms.set(trigger, formInstance.id);
        }

        if (!this.triggers.has(trigger)) {
          this.triggers.set(trigger, []);
        }
        this.triggers.get(trigger)?.push(formInstance.id);

        if (formData.options.references) {
          formData.options.references.forEach((refId: string) => {
            if (!this.references.has(refId)) {
              this.references.set(refId, []);
            }
            // Maintain registration order instead of sorting
            const currentRefs = this.references.get(refId) || [];
            currentRefs.push(formInstance.id);
            this.references.set(refId, currentRefs);
          });
        }

        // For forms that do not have references in the options
        // but are created with other forms referencing them
        if (!this.references.has(formInstance.id)) {
          this.references.set(formInstance.id, []);
        }

        // Now check for action-based triggers
        if (formInstance instanceof ActionForm && formInstance.options.unlock) {
          const unlock = formInstance.options.unlock;
          if (unlock.trigger) {
            // If these triggers are always arrays, handle them as arrays
            if (Array.isArray(unlock.trigger.entityKill)) {
              // Type-check and convert the entityKill array to ensure it's an array of strings
              const entityTypes = unlock.trigger.entityKill
                .map((entry) => {
                  // Handle both string entries and object entries
                  if (typeof entry === "string") {
                    return entry;
                  } else if (typeof entry === "object" && "entity" in entry) {
                    return entry.entity;
                  }
                  return "";
                })
                .filter(Boolean); // Filter out any empty strings

              this.entityKillForms.push({
                form: formInstance,
                entityTypes,
              });
            }

            // Register UseItem triggers with type conversion
            if (
              formInstance instanceof ActionForm &&
              formInstance.options.unlock?.trigger.useItem
            ) {
              this.useItemForms.push({
                form: formInstance,
                items: formInstance.options.unlock.trigger.useItem.map(
                  (item) => ({
                    id: item.id,
                    count: item.count || 1, // Default to 1 if count is undefined
                    removeItem: item.removeItem,
                  })
                ),
              });
            }
            // Handle achievement triggers
            if (unlock.trigger.achievement) {
              unlock.trigger.achievement.forEach((achievementId) => {
                if (!this.triggers.has(achievementId)) {
                  this.triggers.set(achievementId, []);
                }
                this.triggers.get(achievementId)?.push(formInstance.id);
              });
            }
          }
        }
      });
    });

    // Second pass to add all forms created outside of the array structure
    // This ensures forms like pig_plushie are properly registered in references
    const collectAllForms = () => {
      let allForms = new Map<string, FormType>();

      // First add all forms from the main registered arrays
      for (const [id, form] of this.actionForms) {
        allForms.set(id, form);
      }

      for (const [id, form] of this.modalForms) {
        allForms.set(id, form);
      }

      // Now find any forms that might be defined outside the arrays
      forms.forEach(({ forms: formGroup }) => {
        // Check if formGroup is an array
        if (Array.isArray(formGroup)) {
          // Already processed these above
          formGroup.forEach((form: any) => {
            if (
              form instanceof ActionForm ||
              form instanceof ModalForm ||
              form instanceof AchievementForm
            ) {
              allForms.set(form.id, form);
            }
          });
        } else {
          // Handle non-array form objects
          // Using type assertion since we know the structure
          const singleForm = formGroup as unknown as FormType;
          if (singleForm && "id" in singleForm) {
            allForms.set(singleForm.id, singleForm);

            // Make sure it's in the right collection
            if (
              singleForm instanceof ActionForm ||
              singleForm instanceof AchievementForm
            ) {
              this.actionForms.set(singleForm.id, singleForm as ActionForm);
            } else if (singleForm instanceof ModalForm) {
              this.modalForms.set(singleForm.id, singleForm as ModalForm);
            }
          }
        }
      });

      return allForms;
    };

    const allForms = collectAllForms();

    // Now process all forms to ensure references are bidirectional
    for (const [id, form] of allForms) {
      if (form.options.references) {
        form.options.references.forEach((refId: string) => {
          if (!this.references.has(refId)) {
            this.references.set(refId, []);
          }

          // Add this form to the references list of the referenced form if not already there
          const referencedByList = this.references.get(refId) || [];
          if (!referencedByList.includes(id)) {
            referencedByList.push(id);
            this.references.set(refId, referencedByList);
          }
        });
      }
    }
  }

  private registerActionBasedEvents() {
    // entityKill trigger
    world.afterEvents.entityDie.subscribe((event) => {
      if (this.entityKillForms.length > 0) {
        const damager = event.damageSource.damagingEntity;
        if (damager instanceof Player) {
          const deadEntityType = event.deadEntity.typeId;

          for (const { form, entityTypes } of this.entityKillForms) {
            // Check if this form tracks this entity type
            if (entityTypes.includes(deadEntityType)) {
              const unlock = form.options.unlock;
              if (!unlock) continue;

              // Determine if the form is visible to the player (either already unlocked or parent is unlocked)
              const scope = unlock.property === "world" ? "world" : "player";
              const unlockedForms =
                scope === "world"
                  ? getWorldUnlockedForms()
                  : getPlayerUnlockedForms(damager);

              // Check if the form itself is already unlocked
              if (unlockedForms.has(form.id)) {
                continue; // Skip if already unlocked
              }

              // Only start counting when the quest is visible
              let questIsVisible = true;
              if (
                unlock.onlyUnlockWhenVisible &&
                form instanceof AchievementForm &&
                form.achievementOptions.show
              ) {
                // Check if this achievement form is currently visible
                const visibleScope =
                  form.achievementOptions.show.property === "world"
                    ? "world"
                    : "player";
                const visibleForms =
                  visibleScope === "world"
                    ? getWorldVisibleForms()
                    : getPlayerVisibleForms(damager);
                questIsVisible = visibleForms.has(form.id);
              }

              if (!questIsVisible) {
                continue; // Skip if quest isn't visible yet
              }

              // Track progress based on the type of entityKill trigger
              if (unlock.trigger.entityKill) {
                // Handle single entity count tracking
                if (
                  !Array.isArray(unlock.trigger.entityKill) &&
                  "entities" in unlock.trigger.entityKill &&
                  "count" in unlock.trigger.entityKill
                ) {
                  if (
                    unlock.trigger.entityKill.entities.includes(deadEntityType)
                  ) {
                    const progressKey = `${namespace}:progress:${form.id}`;
                    const currentProgress =
                      (damager.getDynamicProperty(progressKey) as number) || 0;
                    damager.setDynamicProperty(
                      progressKey,
                      currentProgress + 1
                    );

                    // Check if we've reached the required count
                    if (
                      currentProgress + 1 >=
                      unlock.trigger.entityKill.count
                    ) {
                      this.unlockFormForTrigger(form, damager);
                    }
                  }
                }
                // Handle multiple entity types with individual counts
                else if (Array.isArray(unlock.trigger.entityKill)) {
                  const firstItem = unlock.trigger.entityKill[0];
                  if (
                    typeof firstItem === "object" &&
                    "entity" in firstItem &&
                    "count" in firstItem
                  ) {
                    // Find the matching entity requirement
                    for (const req of unlock.trigger.entityKill as {
                      entity: string;
                      count: number;
                    }[]) {
                      if (req.entity === deadEntityType) {
                        // Update entity-specific progress counter
                        const progressKey = `${namespace}:progress:${form.id}:${deadEntityType}`;
                        const currentProgress =
                          (damager.getDynamicProperty(progressKey) as number) ||
                          0;
                        damager.setDynamicProperty(
                          progressKey,
                          currentProgress + 1
                        );

                        // Check if all required entities have been killed
                        let allRequirementsMet = true;
                        for (const checkReq of unlock.trigger.entityKill as {
                          entity: string;
                          count: number;
                        }[]) {
                          const checkKey = `${namespace}:progress:${form.id}:${checkReq.entity}`;
                          const progress =
                            (damager.getDynamicProperty(checkKey) as number) ||
                            0;
                          if (progress < checkReq.count) {
                            allRequirementsMet = false;
                            break;
                          }
                        }

                        if (allRequirementsMet) {
                          this.unlockFormForTrigger(form, damager);
                        }

                        break; // We found and handled the matching entity
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // blockBreak trigger
    world.afterEvents.playerBreakBlock.subscribe((event) => {
      if (this.blockBreakForms.length > 0) {
        const player = event.player;
        const brokenBlockType = event.brokenBlockPermutation.type.id;
        for (const { form, blockTypes } of this.blockBreakForms) {
          if (
            form.options.unlock?.onlyUnlockWhenVisible &&
            form instanceof AchievementForm &&
            form.achievementOptions.show
          ) {
            // Check if this achievement form is currently visible
            const visibleScope =
              form.achievementOptions.show.property === "world"
                ? "world"
                : "player";
            const visibleForms =
              visibleScope === "world"
                ? getWorldVisibleForms()
                : getPlayerVisibleForms(player);
            if (!visibleForms.has(form.id)) {
              continue;
            }
          }
          if (blockTypes.includes(brokenBlockType)) {
            this.unlockFormForTrigger(form, player);
          }
        }
      }
    });

    // blockPlace trigger

    world.afterEvents.playerPlaceBlock.subscribe((event) => {
      if (this.blockPlaceForms.length > 0) {
        const player = event.player;
        const placedBlockType = event.block.typeId;
        for (const { form, blockTypes } of this.blockBreakForms) {
          if (blockTypes.includes(placedBlockType)) {
            this.unlockFormForTrigger(form, player);
          }
        }
      }
    });

    // blockInteract trigger

    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      if (this.blockInteractForms.length > 0) {
        const player = event.player;
        const interactedBlockType = event.block.typeId;
        for (const { form, blockTypes } of this.blockInteractForms) {
          if (blockTypes.includes(interactedBlockType)) {
            this.unlockFormForTrigger(form, player);
          }
        }
      }
    });

    // entityInteract trigger (assuming a playerInteractWithEntity event exists)

    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
      if (this.entityInteractForms.length > 0) {
        const player = event.player;
        const interactedEntityType = event.target.typeId;
        for (const { form, entityTypes } of this.entityInteractForms) {
          if (entityTypes.includes(interactedEntityType)) {
            this.unlockFormForTrigger(form, player);
          }
        }
      }
    });

    // Add UseItem trigger registration
    world.afterEvents.itemUse.subscribe((event) => {
      if (this.useItemForms.length > 0) {
        const player = event.source;
        const usedItemId = event.itemStack.typeId;

        for (const { form, items } of this.useItemForms) {
          // Skip if this form has an order as it's handled in handleItemUse
          if (form.options.unlock?.order !== undefined) continue;

          const matchingItem = items.find((item) => item.id === usedItemId);

          if (matchingItem) {
            // Handle item removal before unlocking the form
            if (matchingItem.removeItem) {
              removeItemFromInventory(player, usedItemId);
            }

            this.unlockFormForTrigger(form, player);
          }
        }
      }
    });
  }

  private setDynamicProperty(
    identifier: string,
    value: boolean | number | string | Vector3
  ): void {
    try {
      world.setDynamicProperty(identifier, value);
    } catch (error) {}
  }

  /**
   * Unlocks the given form for the given player based on a trigger (non-item).
   */
  private unlockFormForTrigger(form: ActionForm, player: Player) {
    const unlock = form.options.unlock;
    if (!unlock) return;

    // Check if the form requires visibility before unlocking
    if (
      unlock.onlyUnlockWhenVisible &&
      form instanceof AchievementForm &&
      form.achievementOptions.show
    ) {
      // Check if this achievement form is currently visible
      const visibleScope =
        form.achievementOptions.show.property === "world" ? "world" : "player";
      const visibleForms =
        visibleScope === "world"
          ? getWorldVisibleForms()
          : getPlayerVisibleForms(player);
      if (!visibleForms.has(form.id)) {
        return; // Don't unlock if not visible yet
      }
    }

    const scope = unlock.property === "world" ? "world" : "player";
    let unlockedForms: Set<string> =
      scope === "world"
        ? getWorldUnlockedForms()
        : getPlayerUnlockedForms(player);

    if (!unlockedForms.has(form.id)) {
      unlockedForms.add(form.id);
      if (scope === "world") {
        setWorldUnlockedForms(unlockedForms);
      } else {
        setPlayerUnlockedForms(player, unlockedForms);
      }

      // Play sound if defined
      if (unlock.sound) {
        player.playSound(unlock.sound);
      }

      // Trigger messages
      if (unlock.messages) {
        this.triggerMessages(unlock.messages, player);
      }

      // Handle rewards
      const reward = unlock.reward;
      if (scope === "world") {
        setWorldUnlockedForms(unlockedForms);

        const allPlayers = world.getAllPlayers();
        if (reward) {
          if (typeof reward.xp === "number" && reward.xp > 0) {
            for (const p of allPlayers) {
              p.addLevels(reward.xp);
            }
          }
          if (reward.items && Array.isArray(reward.items)) {
            for (const p of allPlayers) {
              for (const rewardedItem of reward.items) {
                addItemToInventory(
                  p,
                  new ItemStack(rewardedItem.id, rewardedItem.count)
                );
              }
            }
          }
        }
      } else {
        if (reward) {
          if (typeof reward.xp === "number" && reward.xp > 0) {
            player.addLevels(reward.xp);
          }
          if (reward.items && Array.isArray(reward.items)) {
            for (const rewardedItem of reward.items) {
              addItemToInventory(
                player,
                new ItemStack(rewardedItem.id, rewardedItem.count)
              );
            }
          }
        }
      }
      this.checkFormUnlock(player, ""); // Call checkFormUnlock after unlocking
    }

    if (unlock.unlockReferences) {
      // Get all forms that reference this form
      this.references.forEach((referencedBy, parentFormId) => {
        if (referencedBy.includes(form.id)) {
          // Unlock the parent form
          const parentForm =
            this.actionForms.get(parentFormId) ||
            this.modalForms.get(parentFormId);

          if (parentForm instanceof ActionForm) {
            this.unlockFormForTrigger(parentForm, player);
          }
        }
      });
    }
  }
}

export function getWorldUnlockedForms(): Set<string> {
  const unlockedFormsString =
    (world.getDynamicProperty(`${namespace}:unlockedForms`) as string) || "[]";
  return new Set(JSON.parse(unlockedFormsString));
}

export function setWorldUnlockedForms(unlockedForms: Set<string>) {
  world.setDynamicProperty(
    `${namespace}:unlockedForms`,
    JSON.stringify(Array.from(unlockedForms))
  );
}

export function getPlayerUnlockedForms(player: Player): Set<string> {
  const propertyId = `${namespace}:unlockedForms`;
  const unlockedFormsString =
    (player.getDynamicProperty(propertyId) as string) || "[]";
  return new Set(JSON.parse(unlockedFormsString));
}

export function setPlayerUnlockedForms(
  player: Player,
  unlockedForms: Set<string>
) {
  const propertyId = `${namespace}:unlockedForms`;
  player.setDynamicProperty(
    propertyId,
    JSON.stringify(Array.from(unlockedForms))
  );
}

export function getWorldVisibleForms(): Set<string> {
  const visibleFormsString =
    (world.getDynamicProperty(`${namespace}:visibleForms`) as string) || "[]";
  return new Set(JSON.parse(visibleFormsString));
}

export function setWorldVisibleForms(visibleForms: Set<string>) {
  world.setDynamicProperty(
    `${namespace}:visibleForms`,
    JSON.stringify(Array.from(visibleForms))
  );
}

export function getPlayerVisibleForms(player: Player): Set<string> {
  const propertyId = `${namespace}:visibleForms`;
  const visibleFormsString =
    (player.getDynamicProperty(propertyId) as string) || "[]";
  return new Set(JSON.parse(visibleFormsString));
}

export function setPlayerVisibleForms(
  player: Player,
  visibleForms: Set<string>
) {
  const propertyId = `${namespace}:visibleForms`;
  player.setDynamicProperty(
    propertyId,
    JSON.stringify(Array.from(visibleForms))
  );
}

export const form = new FormModule();
