import {
  EquipmentSlot,
  Player,
  PlayerBreakBlockAfterEvent,
  system,
  world,
} from "@minecraft/server";
import {
  decreaseItemDurabilityInHand,
  DecreaseItemDurabilityInHandOptions,
  getItemInSlot,
  removeItemFromInventory,
} from "../../helper/utils";

declare module "../../itemModule" {
  interface ItemBehaviorProperties {
    durability?: {
      ignoreInCreative?: boolean;
      destructionSound?: string;
      convertInto?: string;
    };
  }
}

export interface DurabilityItemOptions {
  id: string;
  ignoreInCreative: boolean;
  destructionSound?: string;
  convertInto?: string;
}

export class DurabilityItem {
  private static readonly items: DurabilityItem[] = [];

  // Constructor to initialize the DurabilityItem class
  constructor(public readonly config: DurabilityItemOptions) {}

  // Register the durability behavior
  static registerBehavior(config: DurabilityItemOptions): void {
    const eventItem = new DurabilityItem(config);
    this.items.push(eventItem);
  }

  // Initialize the durability system (listening to block break event)
  static initialize(): void {
    world.afterEvents.playerBreakBlock.subscribe(this.onBlockBreak);
  }

  // Handle block break event to decrease durability
  static onBlockBreak(event: PlayerBreakBlockAfterEvent) {
    const durabilityItem = DurabilityItem.getItem(event.itemStackBeforeBreak?.typeId);
    if (!durabilityItem) return;

    decreaseItemDurabilityInHand(event.player, {
      ignoreInCreative: durabilityItem.config.ignoreInCreative,
      destructionSound: durabilityItem.config.destructionSound,
      convertInto: durabilityItem.config.convertInto,
    });
  }

  // Helper method to get the DurabilityItem by item identifier
  static getItem(itemId: string | undefined): DurabilityItem | undefined {
    return this.items.find((item) => item.config.id === itemId);
  }
}
