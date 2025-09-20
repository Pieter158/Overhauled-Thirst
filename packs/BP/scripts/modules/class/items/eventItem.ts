import {
  Player,
  system,
  Entity,
  Vector3,
  world,
  PlayerBreakBlockAfterEvent,
  EntityHurtAfterEvent,
  ItemCompleteUseAfterEvent,
  ItemReleaseUseAfterEvent,
  EquipmentSlot,
  PlayerInteractWithEntityAfterEvent,
  PlayerInteractWithEntityBeforeEvent,
  PlayerInteractWithBlockAfterEvent,
  PlayerInteractWithBlockBeforeEvent,
} from "@minecraft/server";
import { getItemInSlot } from "../../helper/utils";

declare module "../../itemModule" {
  interface ItemBehaviorProperties {
    events?: Omit<EventItemOptions, "id">;
  }
}

export interface EventItemOptions {
  id: string;
  onBlockBreak?: (player: Player, location: Vector3) => void;
  onEntityHit?: (player: Player, entity: Entity) => void;
  onCompleteUse?: (player: Player) => void;
  onRelease?: (player: Player) => void;
  onUse?: (player: Player) => void;
  onTick?: (player: Player) => void;
  onUseOnBlockAfter?: (event: PlayerInteractWithBlockAfterEvent) => void;
  onUseOnBlockBefore?: (event: PlayerInteractWithBlockBeforeEvent) => void;
  onUseOnEntityAfter?: (event: PlayerInteractWithEntityAfterEvent) => void;
  onUseOnEntityBefore?: (event: PlayerInteractWithEntityBeforeEvent) => void;
}

export class EventItem {
  private static readonly items: EventItem[] = [];

  // Constructor to initialize the OnEventItem class with optional o
  constructor(public readonly config: EventItemOptions) {}

  // Register the event handlers for an item
  static registerBehavior(config: EventItemOptions): void {
    const eventItem = new EventItem(config);
    this.items.push(eventItem);
  }

  // get item
  static getItem(id: string): EventItem | undefined {
    return this.items.find((item) => item.config.id === id);
  }

  // Initialize the custom event handling system
  static initialize(): void {
    // Block Break event
    world.afterEvents.playerBreakBlock.subscribe((event: PlayerBreakBlockAfterEvent) => {
      const { player, block } = event;
      const itemStack = getItemInSlot(player, EquipmentSlot.Mainhand);
      if (!itemStack) return;

      const item = EventItem.getItem(itemStack.typeId);
      if (!item) return;

      if (itemStack?.typeId === item.config.id && item.config.onBlockBreak) {
        item.config.onBlockBreak(player, block.location);
      }
    });

    // Entity Hurt event
    world.afterEvents.entityHurt.subscribe((event: EntityHurtAfterEvent) => {
      const entity = event.hurtEntity;
      const source = event.damageSource.damagingEntity as Player;

      if (!source) return;
      const itemStack = getItemInSlot(source, EquipmentSlot.Mainhand);
      if (!itemStack) return;
      const item = EventItem.getItem(itemStack!.typeId);
      if (!item) return;

      if (itemStack?.typeId === item.config.id && item.config.onEntityHit) {
        item.config.onEntityHit(source, entity);
      }
    });

    world.afterEvents.itemUse.subscribe((event) => {
      const { itemStack, source: player } = event;
      if (!itemStack) return;

      const item = EventItem.getItem(itemStack!.typeId);
      if (!item) return;

      if (itemStack?.typeId === item.config.id && item.config.onUse) {
        item.config.onUse(player);
      }
    });


 

    // Complete Use event
    world.afterEvents.itemCompleteUse.subscribe((event: ItemCompleteUseAfterEvent) => {
      const { itemStack, source: player } = event;
      if (!itemStack) return;

      const item = EventItem.getItem(itemStack!.typeId);
      if (!item) return;

      if (itemStack?.typeId === item.config.id && item.config.onCompleteUse) {
        item.config.onCompleteUse(player);
      }
    });

    // Release event
    world.afterEvents.itemReleaseUse.subscribe((event: ItemReleaseUseAfterEvent) => {
      const { itemStack, source: player } = event;
      if (!itemStack) return;

      const item = EventItem.getItem(itemStack!.typeId);
      if (!item) return;

      if (itemStack?.typeId === item.config.id && item.config.onRelease) {
        item.config.onRelease(player);
      }
    });

    world.afterEvents.playerInteractWithEntity.subscribe(
      (event: PlayerInteractWithEntityAfterEvent) => {
        const { itemStack } = event;
        if (!itemStack) return;

        const item = EventItem.getItem(itemStack!.typeId);
        if (!item) return;

        if (itemStack?.typeId === item.config.id && item.config.onUseOnEntityAfter) {
          item.config.onUseOnEntityAfter(event);
        }
      }
    );

    world.beforeEvents.playerInteractWithEntity.subscribe(
      (event: PlayerInteractWithEntityBeforeEvent) => {
        const { itemStack } = event;
        if (!itemStack) return;

        const item = EventItem.getItem(itemStack!.typeId);
        if (!item) return;

        system.run(() => {
          if (itemStack?.typeId === item.config.id && item.config.onUseOnEntityBefore) {
            item.config.onUseOnEntityBefore(event);
          }
        });
      }
    );

    world.afterEvents.playerInteractWithBlock.subscribe(
      (event: PlayerInteractWithBlockAfterEvent) => {
        const { itemStack } = event;
        if (!itemStack) return;

        const item = EventItem.getItem(itemStack!.typeId);
        if (!item) return;

        if (itemStack?.typeId === item.config.id && item.config.onUseOnBlockAfter) {
          item.config.onUseOnBlockAfter(event);
        }
      }
    );

    world.beforeEvents.playerInteractWithBlock.subscribe(
      (event: PlayerInteractWithBlockBeforeEvent) => {
        const { itemStack } = event;
        if (!itemStack) return;

        const item = EventItem.getItem(itemStack!.typeId);
        if (!item) return;

        system.run(() => {
          if (itemStack?.typeId === item.config.id && item.config.onUseOnBlockBefore) {
            item.config.onUseOnBlockBefore(event);
          }
        });
      }
    );
  }
}
