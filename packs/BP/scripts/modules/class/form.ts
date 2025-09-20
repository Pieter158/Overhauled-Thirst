import {
  BlockPermutation,
  EntityInventoryComponent,
  Player,
  RawMessage,
  RawText,
  world,
} from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { namespace } from "../../config/_config";
import { getPlayerUnlockedForms, getWorldUnlockedForms } from "../formModule";

interface FormGlobalOptions {
  // title of the form
  title: string;
  // description of the form
  description: string[];
  // OPTIONAL: references to other forms
  references?: string[];
  // OPTIONAL: icon path for the form
  iconPath?: string; // Change to string to match the expected type
}

interface AchievementPathOptions {
  // OPTIONAL: When achievement is locked
  locked?: string;
  // OPTIONAL: When achievement is unlocked
  unlocked?: string;
}

interface ShowOption {
  // OPTIONAL: whether it's player or world based, default is player
  property?: "world" | "player";
  // trigger for showing
  trigger: UnlockTriggerOptions;
  // OPTIONAL: messages to send when shown
  messages?: {
    text: string;
    target: "chat" | "title" | "actionbar" | "toast";
    private: boolean;
    toastTitle?: string;
    toastTexture?: string;
  }[];
  // OPTIONAL: sound to play when shown
  sound?: string;
}

interface AchievementOptions extends Omit<FormGlobalOptions, "iconPath"> {
  // how the achievement is unlocked
  unlock: UnlockOption;
  // OPTIONAL: how the achievement becomes visible
  show?: ShowOption;
  // OPTIONAL: icon paths for the achievement
  buttonLabel?: AchievementPathOptions;
  // OPTIONAL: description for the achievement when locked
  lockedDescription?: string[];
  // OPTIONAL: description label for the achievement
  descriptionLabel?: AchievementPathOptions;
  // OPTIONAL: icon path for the achievement
  iconPath: AchievementPathOptions; // Add specific iconPath for AchievementOptions
  // OPTIONAL: Show progress for countable triggers (e.g., entityKill with count)
  showProgress?: boolean;
  restart?: {
    cost: {
      items?: {
        id: string;
        count: number;
      }[];
      xp?: number;
    };
    reward?: {
      items?: {
        id: string;
        count: number;
      }[];
      xp?: number;
    };
    message?: string; // Message to show when restarting
    sound?: string; // Sound to play when restarting
  };
}
interface FormOptions extends FormGlobalOptions {
  // OPTIONAL: if the form can be opened from an interaction
  interact?: FormInteractOptions;
  // OPTIONAL: wiki information for the form
  wikiInfo?: ActionFormFeatureInfo;
  // OPTIONAL: unlock options for the form
  unlock?: UnlockOption;
  // OPTIONAL: whether to show this form only when all referenced forms are unlocked
  showOnlyWhenReferencesUnlocked?: boolean;
}
interface ModalFormSettings extends FormGlobalOptions {
  // controls for the modal form
  controls: Array<{
    type: "toggle" | "slider" | "dropdown" | "textField";
    label: string;
    options?: any; // For dropdown options
    defaultValue?: any;
    dynamicProperty?: string; // Add this line
  }>;
  //  OPTIONAL: if the form can be opened from an interaction
  interact?: FormInteractOptions;
  // OPTIONAL: message the player gets when the form is saved
  submitMessage?: string;
  // OPTIONAL: if the form can be unlocked
  unlock?: UnlockOption;
  // OPTIONAL: whether to show this form only when all referenced forms are unlocked
  showOnlyWhenReferencesUnlocked?: boolean;
}
export interface UnlockByItemOptions {
  id: string;
  count?: number; // Keep as optional in the configuration
  removeItem?: boolean;
}
interface UnlockTriggerOptions {
  //  OPTIONAL: unlocked when the player kills an entity
  entityKill?:
    | string[]
    | { entities: string[]; count: number }
    | { entity: string; count: number }[]; // Multi-entity format with different counts per entity
  //  OPTIONAL: unlocked when the player breaks a block
  blockDestroy?: string[];
  //  OPTIONAL: unlocked when the player places a block
  blockPlace?: string[];
  //  OPTIONAL: unlocked when the player interacts with a block
  blockInteract?: string[];
  //  OPTIONAL: unlocked when the player interacts with an entity
  entityInteract?: string[];
  //  OPTIONAL: unlocked when the player spawns an entity
  entitySpawn?: string[];
  //  OPTIONAL: unlocked when the a scriptevent is triggered
  scriptEvent?: {
    message: string;
    id: string;
  };
  // OPTIONAL: unlocked when the player has the items in their inventory
  hasItem?: UnlockByItemOptions[][];
  // OPTIONAL: unlocked when the player uses an item
  useItem?: UnlockByItemOptions[];
  // OPTIONAL: unlocked when the player unlocks an achievement
  achievement?: string[];
}
interface UnlockOption {
  // OPTIONAL: whether it's player or world based, default is player
  property?: "world" | "player";
  // OPTIONAL: trigger for unlocking
  trigger: UnlockTriggerOptions;
  // OPTIONAL: messages to send when unlocked
  messages: {
    text: string;
    target: "chat" | "title" | "actionbar" | "toast";
    private: boolean;
    toastTitle?: string;
    toastTexture?: string;
  }[];
  // OPTIONAL: order of the form in the form list
  order?: number;
  // OPTIONAL: sound to play when unlocked
  sound?: string;
  // OPTIONAL: reward for unlocking
  reward?: {
    items?: {
      id: string;
      count: number;
    }[];
    xp?: number;
  };
  // OPTIONAL: Unlock parent forms that reference this form
  unlockReferences?: boolean;
  // OPTIONAL: Only unlock when the parent form is visible
  onlyUnlockWhenVisible?: boolean;
  // NEW: restart options
  restart?: {
    startItems?: {
      items?: {
        id: string;
        count: number;
      }[];
    };
    cost?: {
      items?: {
        id: string;
        count: number;
      }[];
      xp?: number;
    };
    reward?: {
      items?: {
        id: string;
        count: number;
      }[];
      xp?: number;
    };
    message?: string;
    sound?: string;
  };
}
interface FormInteractOptions {
  // OPTIONAL: if the form can be opened from an interaction with a block
  blocks?: (BlockPermutation | string)[];
  // OPTIONAL: if the form can be opened from an interaction with an entity
  entities?: string[];
}

export enum Behavior {
  FRIENDLY = "friendly",
  NEUTRAL = "neutral",
  HOSTILE = "hostile",
}
interface CustomCraftingTable {
  // wether it can be crafted from this crafting table
  recipe: boolean;
  // block ID of the custom crafting table
  blockID: string;
}
interface ActionFormFeatureInfo {
  // OPTIONAL: behavior of the subject
  behavior?: Behavior;
  // OPTIONAL: biomes the subject can be found in
  biomes?: string[];
  // OPTIONAL: drops the subject can drop
  drops?: string[];
  // OPTIONAL: food the subject can
  food?: string[];
  // OPTIONAL: wether the subject has a crafting table recipe
  hasCraftingTableRecipe?: boolean;
  isMarketObtainable?: boolean;
  isQuestObtainable?: boolean;
  // OPTIONAL: wether the subject is breedable
  isBreedable?: boolean;
  // OPTIONAL: wether the subject is shearable
  isShearable?: boolean;
  // OPTIONAL: wether the subject is tameable
  isTameable?: boolean;
  // OPTIONAL: wether the subject is rideable
  isRideable?: boolean;
  // OPTIONAL: wether the subject is compostable
  hasCustomTableRecipe?: CustomCraftingTable;
  // OPTIONAL: wether the subject is compostable
  isCompostable?: boolean;
  stonecutter?: string;
}

function addFormButtons(
  form: ActionFormData,
  formId: string,
  referencedForms: Map<string, ActionForm | ModalForm>,
  referencesMap: Map<string, string[]>,
  unlockedForms: Set<string>,
  player: Player,
  visibleForms?: Set<string>
): number {
  let buttonCount = 0;
  const references = referencesMap.get(formId);
  if (references) {
    references.forEach((refId) => {
      const refForm = referencedForms.get(refId);
      if (!refForm) return;

      // For each referenced form, determine its property and get correct unlocked set
      const refScope =
        refForm.options.unlock?.property === "world" ? "world" : "player";
      const refUnlockedForms =
        refScope === "world"
          ? getWorldUnlockedForms()
          : getPlayerUnlockedForms(player);

      // Check if this form should be visible based on its references
      let shouldShow = true;
      if (
        refForm.options.showOnlyWhenReferencesUnlocked &&
        refForm.options.references
      ) {
        for (const achievementRefId of refForm.options.references) {
          const achievementForm = referencedForms.get(achievementRefId);
          if (achievementForm) {
            const achievementScope =
              achievementForm.options.unlock?.property === "world"
                ? "world"
                : "player";
            const achievementUnlocked =
              achievementScope === "world"
                ? getWorldUnlockedForms().has(achievementRefId)
                : getPlayerUnlockedForms(player).has(achievementRefId);

            if (!achievementUnlocked) {
              shouldShow = false;
              break;
            }
          }
        }
      }

      if (refForm instanceof AchievementForm) {
        // Check if achievement should be visible
        const showScope =
          refForm.achievementOptions.show?.property === "world"
            ? "world"
            : "player";
        const currentVisibleForms =
          visibleForms ||
          (showScope === "world"
            ? getWorldUnlockedForms()
            : getPlayerUnlockedForms(player));

        // If show option is defined, check visibility conditions
        if (refForm.achievementOptions.show) {
          if (!currentVisibleForms.has(refId)) {
            return; // Don't show this achievement if visibility conditions aren't met
          }
        }

        const achievementUnlocked = refUnlockedForms.has(refId);
        const title = refForm.getTitle();
        // Use global iconPath as fallback if state-specific path is not defined
        const iconPath = achievementUnlocked
          ? refForm.achievementOptions.iconPath?.unlocked ||
            refForm.options.iconPath ||
            ""
          : refForm.achievementOptions.iconPath?.locked ||
            refForm.options.iconPath ||
            "";

        // Only use button label if defined for current state
        const buttonLabel = achievementUnlocked
          ? refForm.achievementOptions.buttonLabel?.unlocked
          : refForm.achievementOptions.buttonLabel?.locked;

        form.button(
          {
            rawtext: [
              title,
              { text: "\n" },
              ...(buttonLabel ? [{ translate: buttonLabel }] : []),
            ],
          },
          iconPath
        );
        buttonCount++;
      } else if (shouldShow) {
        // Only show regular forms if they should be visible
        if (refUnlockedForms.has(refId) || !refForm.options.unlock) {
          const title =
            refForm instanceof ActionForm
              ? refForm.getTitle()
              : { translate: refForm.getTitle() };
          const iconPath = refForm.options.iconPath || "";
          form.button(title, iconPath);
          buttonCount++;
        }
      }
    });
  }
  return buttonCount;
}

export class ActionForm {
  private _isMainForm: boolean;

  constructor(
    readonly id: string,
    readonly options: FormOptions,
    isMainForm: boolean = false
  ) {
    this._isMainForm = isMainForm;
  }

  private translateString(str: string): RawMessage {
    return { translate: str };
  }

  private translateStrings(strings: string[]): RawMessage[] {
    return strings.map((str) => ({ translate: str }));
  }

  public getTitle(): RawMessage {
    return this.translateString(
      this.options.title || `item.${namespace}:${this.id}`
    );
  }

  public get isMainForm(): boolean {
    return this._isMainForm;
  }

  public compile(
    player: Player,
    referencedForms: Map<string, ActionForm | ModalForm>,
    referencesMap: Map<string, string[]>,
    unlockedForms: Set<string>,
    visibleForms?: Set<string>
  ): {
    form: ActionFormData;
    buttonCount: number;
    backButtonIndex?: number;
    restartButtonIndex?: number;
  } {
    const form = new ActionFormData();
    form.title(this.getTitle());

    const body: RawMessage[] = [];
    const newlines: RawMessage = { text: "\n\n" };
    const singleNewline: RawMessage = { text: "\n" };

    if (this.options.description) {
      this.translateStrings(this.options.description).forEach((desc) => {
        body.push(singleNewline, desc);
      });
    }

    const wikiInfo = this.options.wikiInfo;
    if (wikiInfo) {
      if (wikiInfo) {
        if (wikiInfo.biomes) {
          if (wikiInfo.biomes.length === 0) {
            body.push(newlines, { translate: `${namespace}.form.no_biomes` });
          } else {
            if (wikiInfo.biomes.length === 1) {
              body.push(
                newlines,
                { translate: `${namespace}.form.biomes_singular` },
                { text: " " }
              );
            } else {
              body.push(
                newlines,
                { translate: `${namespace}.form.biomes_plural` },
                { text: " " }
              );
            }
            for (const biome of wikiInfo.biomes) {
              body.push(
                { translate: `${namespace}.form.biome.${biome}` },
                { text: "§7,§r " }
              );
            }
            body.pop(); // Remove trailing comma
          }
        }

        if (wikiInfo.isRideable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isRideable
              ? `${namespace}.form.rideable`
              : `${namespace}.form.not_rideable`,
          });
        }

        if (wikiInfo.isBreedable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isBreedable
              ? `${namespace}.form.breedable`
              : `${namespace}.form.not_breedable`,
          });
        }

        if (wikiInfo.isTameable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isTameable
              ? `${namespace}.form.tameable`
              : `${namespace}.form.not_tameable`,
          });
        }

        if (wikiInfo.behavior) {
          body.push(newlines, {
            translate: `${namespace}.form.behavior.${wikiInfo.behavior}`,
          });
        }

        if (wikiInfo.food) {
          if (wikiInfo.food.length === 0) {
            body.push(newlines, { translate: `${namespace}.form.no_food` });
          } else {
            body.push(
              newlines,
              { translate: `${namespace}.form.food` },
              { text: " " }
            );
            for (const item of wikiInfo.food) {
              body.push({ translate: item }, { text: ", " });
            }
            body.pop(); // Remove trailing comma
          }
        }

        if (wikiInfo.drops) {
          if (wikiInfo.drops.length === 0) {
            body.push(newlines, { translate: `${namespace}.form.no_drops` });
          } else {
            body.push(
              newlines,
              { translate: `${namespace}.form.drops` },
              { text: " " }
            );
            for (const drop of wikiInfo.drops) {
              body.push({ translate: drop }, { text: ", " });
            }
            body.pop(); // Remove trailing comma
          }
        }

        if (wikiInfo.hasCraftingTableRecipe !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.hasCraftingTableRecipe
              ? `${namespace}.form.recipe`
              : `${namespace}.form.no_recipe`,
          });
        }

        if (wikiInfo.isMarketObtainable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isMarketObtainable
              ? `${namespace}.form.isMarketObtainable`
              : `${namespace}.form.no_isMarketObtainable`,
          });
        }

        if (wikiInfo.isQuestObtainable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isQuestObtainable
              ? `${namespace}.form.isQuestObtainable`
              : `${namespace}.form.no_isQuestObtainable`,
          });
        }

        if (wikiInfo.hasCustomTableRecipe !== undefined) {
          if (wikiInfo.hasCustomTableRecipe.recipe !== undefined) {
            body.push(
              newlines,
              {
                translate: wikiInfo.hasCustomTableRecipe.recipe
                  ? `${namespace}.form.custom.recipe`
                  : `${namespace}.form.custom.no_recipe`,
              },
              {
                translate: `tile.${wikiInfo.hasCustomTableRecipe.blockID}.name`,
              },
              { text: "§r." }
            );
          }
        }

        if (wikiInfo.isShearable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isShearable
              ? `${namespace}.form.shearable`
              : `${namespace}.form.no_shearable`,
          });
        }

        if (wikiInfo.isCompostable !== undefined) {
          body.push(newlines, {
            translate: wikiInfo.isCompostable
              ? `${namespace}.form.compostable`
              : `${namespace}.form.not_compostable`,
          });
        }

        if (wikiInfo.stonecutter !== undefined) {
          body.push(
            newlines,
            {
              translate: `${namespace}.form.stonecutter`,
            },
            {
              translate: wikiInfo.stonecutter,
            },
            { text: "§r." }
          );
        }
      }
    }

    let buttonCount = addFormButtons(
      form,
      this.id,
      referencedForms,
      referencesMap,
      unlockedForms,
      player,
      visibleForms
    );
    let backButtonIndex: number | undefined;

    // Add back button if not main form
    if (!this.isMainForm) {
      form.button({ translate: `${namespace}.form.back` });
      backButtonIndex = buttonCount;
      buttonCount++;
    }

    body.push(newlines);
    form.body({ rawtext: body });
    // Return restartButtonIndex as undefined for plain ActionForm
    return {
      form,
      buttonCount,
      backButtonIndex,
      restartButtonIndex: undefined,
    };
  }
}

export class ModalForm {
  constructor(
    readonly id: string,
    readonly options: ModalFormSettings,
    private _isMainForm: boolean = false
  ) {}

  public getTitle(): string {
    return this.options.title;
  }

  public get isMainForm(): boolean {
    return this._isMainForm;
  }

  public compile(): ModalFormData {
    const form = new ModalFormData().title(this.options.title);

    this.options.controls.forEach((control) => {
      let value = control.defaultValue;
      if (control.dynamicProperty) {
        const dynamicValue = world.getDynamicProperty(control.dynamicProperty);
        if (dynamicValue !== undefined) {
          value = dynamicValue;
        }
      }
      switch (control.type) {
        case "toggle":
          form.toggle(control.label, { defaultValue: value as boolean });
          break;
        case "slider":
          form.slider(control.label, control.options.min, control.options.max, {
            defaultValue: value as number,
            valueStep: control.options.step,
          });
          break;
        case "dropdown":
          form.dropdown(control.label, control.options, {
            defaultValueIndex: value as number,
          });
          break;
        case "textField":
          form.textField(control.label, control.options.placeholder, {
            defaultValue: value as string,
          });
          break;
      }
    });

    return form;
  }
}

export class AchievementForm extends ActionForm {
  public achievementOptions: AchievementOptions;

  constructor(
    id: string,
    options: AchievementOptions,
    isMainForm: boolean = false
  ) {
    super(
      id,
      {
        title: options.title,
        description: options.description,
        references: options.references,
        iconPath: "", // Set to empty string as it will be handled separately
        unlock: options.unlock,
      },
      isMainForm
    );
    this.achievementOptions = options;
  }

  private formatRestartCost(cost: {
    items?: { id: string; count: number }[];
    xp?: number;
  }): string {
    const costParts: string[] = [];

    if (typeof cost.xp === "number" && cost.xp > 0) {
      costParts.push(`${cost.xp}xp`);
    }

    if (cost.items && cost.items.length > 0) {
      cost.items.forEach((item) => {
        // Use translate key for item names
        costParts.push(`${item.count}x ${item.id}`);
      });
    }

    return costParts.join(" & ");
  }

  public compile(
    player: Player,
    referencedForms: Map<string, ActionForm | ModalForm>,
    referencesMap: Map<string, string[]>,
    unlockedForms: Set<string>,
    visibleForms?: Set<string>
  ): {
    form: ActionFormData;
    buttonCount: number;
    backButtonIndex?: number;
    restartButtonIndex?: number;
  } {
    const form = new ActionFormData();
    const isUnlocked = unlockedForms.has(this.id);
    form.title({ translate: this.achievementOptions.title });

    const body: RawMessage[] = [];
    const doubleNewline: RawMessage = { text: "\n\n" };
    const singleNewline: RawMessage = { text: "\n" };

    // Show description as usual
    const description = isUnlocked
      ? this.achievementOptions.description
      : this.achievementOptions.lockedDescription ||
        this.achievementOptions.description;
    description.forEach((desc) => {
      body.push(singleNewline, { translate: desc });
    });
    body.push(doubleNewline);

    if (this.achievementOptions.descriptionLabel) {
      const label = isUnlocked
        ? this.achievementOptions.descriptionLabel.unlocked
        : this.achievementOptions.descriptionLabel.locked;
      if (label) {
        body.push(singleNewline, { translate: label });
      }
    }

    // Show progress for countable achievements if they're not unlocked yet
    if (
      !isUnlocked &&
      this.achievementOptions.showProgress &&
      this.achievementOptions.unlock?.trigger
    ) {
      const unlock = this.achievementOptions.unlock;

      // Check for entity kill progress
      if (unlock.trigger.entityKill) {
        // Single count format with entities array and count property
        if (
          !Array.isArray(unlock.trigger.entityKill) &&
          "entities" in unlock.trigger.entityKill &&
          "count" in unlock.trigger.entityKill
        ) {
          const totalNeeded = unlock.trigger.entityKill.count;
          // Get the current progress from player's dynamic property
          const progressKey = `${namespace}:progress:${this.id}`;
          const currentProgress =
            (player.getDynamicProperty(progressKey) as number) || 0;

          // Determine entity name for display
          let entityName = "";
          if (
            Array.isArray(unlock.trigger.entityKill.entities) &&
            unlock.trigger.entityKill.entities.length === 1
          ) {
            entityName = `entity.${unlock.trigger.entityKill.entities[0]}.name`;
            if (
              unlock.trigger.entityKill.entities[0].startsWith("minecraft:")
            ) {
              entityName = `entity.${unlock.trigger.entityKill.entities[0].replace(
                "minecraft:",
                ""
              )}.name`;
            }
          } else if (
            Array.isArray(unlock.trigger.entityKill.entities) &&
            unlock.trigger.entityKill.entities.length > 1
          ) {
            entityName = unlock.trigger.entityKill.entities
              .map((eid) =>
                eid.startsWith("minecraft:")
                  ? `entity.${eid.replace("minecraft:", "")}.name`
                  : `entity.${eid}.name`
              )
              .join(", ");
          } else {
            entityName = "entity.unknown.name";
          }

          // Add progress display
          body.push(
            singleNewline,
            { translate: `${namespace}.achievement.needed.entity` },
            {
              translate: entityName,
            },
            {
              translate: `${namespace}.achievement.sumup_count`,
              with: [`${currentProgress}`, `${totalNeeded}`],
            }
          );
        }
        // Multi-entity format - array of {entity, count} objects
        else if (Array.isArray(unlock.trigger.entityKill)) {
          // First verify we have the expected format by checking the first element
          const firstItem = unlock.trigger.entityKill[0];
          if (
            typeof firstItem === "object" &&
            "entity" in firstItem &&
            "count" in firstItem
          ) {
            body.push(singleNewline, {
              translate: `${namespace}.achievement.needed.entity`,
            });

            // Now TypeScript knows this is an array of objects with entity and count
            for (const requirement of unlock.trigger.entityKill as {
              entity: string;
              count: number;
            }[]) {
              const entityId = requirement.entity;
              const totalNeeded = requirement.count;
              // Get entity-specific progress using a compound key
              const progressKey = `${namespace}:progress:${this.id}:${entityId}`;
              const currentProgress =
                (player.getDynamicProperty(progressKey) as number) || 0;

              // Format entity name for display - extract just the name part after the colon
              let entityName = `entity.${entityId}.name`;
              if (entityId.startsWith("minecraft:")) {
                entityName = entityName.replace("minecraft:", ""); // Remove namespace prefix
              }

              // Add progress line for this entity
              body.push(
                singleNewline,
                { translate: `${namespace}.achievement.sumup_symbol` },
                {
                  translate: entityName,
                },
                {
                  translate: `${namespace}.achievement.sumup_count`,
                  with: [`${currentProgress}`, `${totalNeeded}`],
                }
              );
            }
          }
        }
      }

      // Add check for hasItem progress
      if (unlock.trigger.hasItem) {
        body.push(singleNewline, {
          translate: `${namespace}.achievement.needed`,
        });

        // For each item group (treating the first one as the main requirement)
        if (unlock.trigger.hasItem.length > 0) {
          const firstItemGroup = unlock.trigger.hasItem[0];

          for (const item of firstItemGroup) {
            if (!item.id) continue;

            // Get item name for display
            let itemName = `item.${item.id}`;
            if (item.id.startsWith("minecraft:")) {
              itemName = itemName.replace("minecraft:", "") + ".name"; // Remove namespace prefix
            }

            // Get item count from inventory
            const inventory = player.getComponent(
              "inventory"
            ) as EntityInventoryComponent;
            const container = inventory.container!;
            let foundCount = 0;

            // Count matching items in inventory
            for (let i = 0; i < container.size; i++) {
              const invItem = container.getItem(i);
              if (invItem && invItem.typeId === item.id) {
                foundCount += invItem.amount;
              }
            }

            // Get needed count
            const neededCount = item.count || 1;

            // Display progress - show "1/1" if the player has enough items instead of the actual count
            const displayCount =
              foundCount >= neededCount ? neededCount : foundCount;

            // Display progress
            body.push(
              singleNewline,
              { translate: `${namespace}.achievement.sumup_symbol` },
              { translate: itemName },
              {
                translate: `${namespace}.achievement.sumup_count`,
                with: [`${displayCount}`, `${neededCount}`],
              }
            );
          }
        }
      }
    }

    const unlock = this.achievementOptions.unlock;
    // New: check if quest was restarted by looking for a dynamic property
    const restartedFlag = player.getDynamicProperty(
      `${namespace}:restarted:${this.id}`
    );
    if (!isUnlocked && restartedFlag && unlock?.restart?.reward) {
      // Show restart reward instead of original reward
      const { xp, items } = unlock.restart.reward!;
      body.push(
        { text: "\n\n" },
        { translate: `${namespace}.achievement.restart.reward` },
        { text: " " }
      );
      let firstElement = true;
      if (typeof xp === "number" && xp > 0) {
        body.push({ text: `${xp}xp` });
        firstElement = false;
      }
      if (items && items.length > 0) {
        items.forEach((itemData: { id: string; count: number }) => {
          if (!firstElement) {
            body.push({ text: " & " });
          }
          body.push(
            { translate: `item.${itemData.id}` },
            { text: ` (${itemData.count}x)` }
          );
          firstElement = false;
        });
      }
      body.push(doubleNewline);
    } else if (!isUnlocked && unlock?.reward) {
      // Normal first-time reward display
      const { xp, items } = unlock.reward;
      body.push(
        { text: "\n\n" },
        { translate: `${namespace}.achievement.reward` },
        { text: " " }
      );
      let firstElement = true;
      if (typeof xp === "number" && xp > 0) {
        body.push({ text: `${xp}xp` });
        firstElement = false;
      }
      if (items && items.length > 0) {
        items.forEach((itemData: { id: string; count: number }) => {
          if (!firstElement) {
            body.push({ text: " & " });
          }
          body.push(
            { translate: `item.${itemData.id}` },
            { text: ` (${itemData.count}x)` }
          );
          firstElement = false;
        });
      }
      body.push(doubleNewline);
    }

    // Add referenced forms buttons
    let buttonCount = addFormButtons(
      form,
      this.id,
      referencedForms,
      referencesMap,
      unlockedForms,
      player,
      visibleForms
    );
    let restartButtonIndex: number | undefined;
    let backButtonIndex: number | undefined;

    if (isUnlocked && unlock?.restart) {
      if (unlock.restart.cost) {
        // Display restart button with cost
        const costText = this.formatRestartCost(unlock.restart.cost);
        form.button({
          rawtext: [
            { translate: `${namespace}.achievement.restart` },
            { text: "\n" },
            { translate: `${namespace}.achievement.restart.cost` },
            { text: `: ${costText}` },
          ],
        });
      } else {
        // Display restart button without cost
        form.button({ translate: `${namespace}.achievement.restart` });
      }
      restartButtonIndex = buttonCount;
      buttonCount++;
    }
    if (!this.isMainForm) {
      form.button({ translate: `${namespace}.form.back` });
      backButtonIndex = buttonCount;
      buttonCount++;
    } else {
      body.push(doubleNewline);
    }

    form.body({ rawtext: body });
    return { form, buttonCount, backButtonIndex, restartButtonIndex };
  }
}
