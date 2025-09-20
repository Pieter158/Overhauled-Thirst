import {
  Player,
  system,
  world,
  ItemUseAfterEvent,
  ItemReleaseUseAfterEvent,
  ItemStopUseAfterEvent,
  EquipmentSlot,
  Entity,
  GameMode,
  EntityInventoryComponent,
  ItemCooldownComponent,
} from "@minecraft/server";
import {
  playAnimations,
  emitEffects,
  loopChargeEffects,
  resetAnimations,
} from "../effects/effectsManager";
import { ChargeVisualEffects } from "../effects/effectsManager";
import { ChargeAnimationOptions } from "../animations";
import { getItemInSlot, removeItemFromInventory } from "../../helper/utils";
import { ItemBehaviorProperties } from "../../itemModule";

declare module "../../itemModule" {
  interface ItemBehaviorProperties {
    charge: Omit<ChargeItemOptions, "id">;
  }
}

export interface ChargeItemOptions {
  id: string;
  time: number;
  ammoItemID?: string;
  ignoreSneak?: boolean;
  animations?: ChargeAnimationOptions;
  visualEffects?: ChargeVisualEffects;
  onStart?: (player: Player) => void;
  onEnd?: (player: Player) => void;
  onStop?: (player: Player) => void;
  onCharge?: { onInterval?: (player: Player) => void; interval?: number }[];
  onRelease?: (player: Player) => void;
}

export class ChargeItem {
  private static readonly items: ChargeItem[] = [];

  static playersCharging = new Map<Player, number>();
  static playerChargeStartTick = new Map<Player | Entity, number>();
  static playerReleaseState = new Map<Player, boolean>();
  static playerHasReleased = new Map<Player, boolean>();
  static activeChargeIntervals = new Map<Player, number>();
  public static playerIsCharging = new Map<Player | Entity, boolean>();

  // Constructor to initialize the ChargeItem class
  constructor(public readonly config: ChargeItemOptions) {}

  // Register the charge behavior
  static registerBehavior(config: ChargeItemOptions): void {
    const eventItem = new ChargeItem(config);
    this.items.push(eventItem);
  }

  // get item
  static getItem(id: string): ChargeItem | undefined {
    return ChargeItem.items.find((item) => item.config.id === id);
  }

  // Initialize the charge system (listening to charge-related events)
  static initialize(): void {
    world.afterEvents.itemReleaseUse.subscribe(this.onChargeReleaseUse.bind(this));
    world.afterEvents.itemUse.subscribe(this.onChargeUse.bind(this));
    world.afterEvents.itemStopUse.subscribe(this.onChargeStopUse.bind(this));

    this.handleGlobalChargeCheck();
  }

  static handleGlobalChargeCheck() {
    system.runInterval(() => {
      const players = world.getPlayers();

      players.forEach((player) => {
        const itemStack = getItemInSlot(player, EquipmentSlot.Mainhand);
        const item = this.getItem(itemStack?.typeId!);

        if (!item) return;

        // Only call handleCharge if we start charging, not on every tick
        if (
          itemStack?.typeId === item.config.id &&
          this.playerIsCharging.get(player) &&
          !this.activeChargeIntervals.has(player)
        ) {
          this.handleCharge(player, item);
        }
      });
    }, 1);
  }

  static onChargeReleaseUse(event: ItemReleaseUseAfterEvent) {
    const { itemStack, source: player } = event;

    if (!this.playerIsCharging.get(player)) {
      return;
    }

    const item = this.getItem(itemStack?.typeId!);
    if (!item) return;

    const chargeDuration = (item.config.time || 0) * 20;
    const startChargeTime = this.playerChargeStartTick.get(player);
    const currentTick = system.currentTick;

    if (startChargeTime === undefined) {
      resetAnimations(player);
      return;
    }

    const elapsedTime = currentTick - startChargeTime;

    if (elapsedTime < chargeDuration) {
      resetAnimations(player);
      this.playerIsCharging.set(player, false);
      return;
    }

    this.playerIsCharging.set(player, false);

    if (item.config.animations?.onRelease) {
      playAnimations(item.config.animations?.onRelease, player);
    }
    if (item.config.visualEffects?.onRelease) {
      emitEffects(item.config.visualEffects?.onRelease?.particles, player, "particle");
      emitEffects(item.config.visualEffects?.onRelease?.sounds, player, "sound");
    }
    if (item.config.onRelease) {
      item.config.onRelease(player);
      const cooldown = itemStack?.getComponent("minecraft:cooldown") as ItemCooldownComponent;

      if (cooldown) {
        cooldown.startCooldown(player);
      }
    }

    if (item.config.ammoItemID) {
      removeItemFromInventory(player, item.config.ammoItemID);
    }

    this.playerHasReleased.set(player, true);

    // Clear the charge interval for the player
    if (this.activeChargeIntervals.has(player)) {
      const intervalId = this.activeChargeIntervals.get(player);
      system.clearRun(intervalId!);
      this.activeChargeIntervals.delete(player);
    }

    system.runTimeout(() => {
      this.playerHasReleased.set(player, false);
      this.onChargeStopUse(event as unknown as ItemStopUseAfterEvent);
    }, 5);
  }

  static onChargeUse(event: ItemUseAfterEvent) {
    const { itemStack } = event;

    const player = event.source;

    const item = this.getItem(itemStack?.typeId!);
    if (!item) return;

    if (itemStack?.typeId === item.config.id) {
      if (item.config.ignoreSneak && player.isSneaking) {
        return;
      }

      // Check if there is an ammo item and attempt to find it in the inventory
      if (
        player.getGameMode() !== GameMode.Creative &&
        item.config.ammoItemID &&
        !this.playerHasAmmo(player, item.config.ammoItemID)
      ) {
        return;
      }

      this.playerIsCharging.set(player, true);
      this.playerChargeStartTick.set(player, system.currentTick);

      const chargeDuration = (item.config.time || 0) * 20;

      const onChargeAnimations = item.config.animations?.onCharge;
      const onStartEffects = item.config.visualEffects?.onStart;
      const onChargeEffects = item.config.visualEffects?.onCharge;
      const onEndEffects = item.config.visualEffects?.onEnd;

      emitEffects(onStartEffects?.particles, player, "particle");
      emitEffects(onStartEffects?.sounds, player, "sound");

      if (onChargeEffects) {
        loopChargeEffects(onChargeEffects.particles, player, "particle");
        loopChargeEffects(onChargeEffects.sounds, player, "sound");
      }

      if (item.config.onStart) {
        item.config.onStart(player);
      }

      playAnimations(onChargeAnimations, player);

      this.handleCharge(player, item);

      // Trigger onEnd effects after the charge duration
      system.runTimeout(() => {
        if (this.playerIsCharging.get(player)) {
          emitEffects(onEndEffects?.particles, player, "particle");
          emitEffects(onEndEffects?.sounds, player, "sound");
          if (item.config.onEnd) {
            item.config.onEnd(player);
          }
        }
      }, chargeDuration);
    }
  }

  static handleCharge(player: Player, item: ChargeItem) {
    const chargeDuration = (item.config.time || 0) * 20;
    const startTick = system.currentTick;

    // Clear any existing intervals for this player
    if (this.activeChargeIntervals.has(player)) {
      const previousIntervalId = this.activeChargeIntervals.get(player);
      system.clearRun(previousIntervalId!);
    }

    item.config.onCharge?.forEach(({ onInterval, interval }) => {
      const intervalTicks = interval || 1;
      let lastTriggerTick = startTick;

      const intervalId = system.runInterval(() => {
        const currentTick = system.currentTick;
        const elapsedTime = currentTick - startTick;

        if (
          elapsedTime < chargeDuration &&
          this.playerIsCharging.get(player) &&
          currentTick - lastTriggerTick >= intervalTicks
        ) {
          onInterval?.(player);
          lastTriggerTick = currentTick;
        }

        // Stop interval if charge duration reached or charging stopped
        if (elapsedTime >= chargeDuration || !this.playerIsCharging.get(player)) {
          system.clearRun(intervalId);
          this.activeChargeIntervals.delete(player);
        }
      }, 1);

      this.activeChargeIntervals.set(player, intervalId);
    });
  }

  static onChargeStopUse(event: ItemStopUseAfterEvent) {
    const { itemStack, source: player } = event;
    if (this.playerHasReleased.get(player) === true) {
      return;
    }

    this.playerIsCharging.set(player, false);

    const item = this.getItem(itemStack?.typeId!);
    if (!item) return;

    if (this.playerReleaseState.get(player)) {
      resetAnimations(player);
      this.playerReleaseState.set(player, false);
      return;
    }

    if (item.config.onStop) {
      item.config.onStop(player);
    }

    resetAnimations(player);

    if (this.activeChargeIntervals.has(player)) {
      const intervalId = this.activeChargeIntervals.get(player);
      system.clearRun(intervalId!);
      this.activeChargeIntervals.delete(player);
    }
  }

  static playerHasAmmo(player: Player, ammoItemID: string): boolean {
    const inventory = player.getComponent("inventory") as EntityInventoryComponent;
    const container = inventory?.container;

    if (!container) return false;

    for (let slotId = 0; slotId < container.size; slotId++) {
      const slot = container.getItem(slotId);
      if (slot?.typeId === ammoItemID) {
        return true;
      }
    }

    return false;
  }
}
