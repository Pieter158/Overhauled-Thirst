import { Player, system, EntityInventoryComponent, world } from "@minecraft/server";
import { globalLore, namespace, productNameForLore } from "../../../config/_config";

declare module "../../itemModule" {
  interface ItemBehaviorProperties {
    lore?: {
      lines: string[];
    };
  }
}

export interface LoreItemOptions {
  id: string;
  lines: string[];
}

export class LoreItem {
  private static readonly items: LoreItem[] = [];
  // Constructor to initialize the LoreItem class
  constructor(public readonly config: LoreItemOptions) {}

  // Register the lore behavior for an item
  static registerBehavior(config: LoreItemOptions): void {
    const eventItem = new LoreItem(config);
    LoreItem.items.push(eventItem);
  }

  // Initialize the lore system (runs periodically to check and set item lore)
  static initialize(): void {
    system.runInterval(() => {
      const players = world.getPlayers();
      players.forEach((player) => {
        const inventory = player.getComponent("inventory") as EntityInventoryComponent;
        const container = inventory.container!;

        for (let i = 0; i < container.size; i++) {
          let itemStack = container.getItem(i);
          if (!itemStack) continue;

          let lore: string[] = itemStack.getLore() || [];

          if (itemStack.typeId.startsWith(namespace)) {
            let loreChanged = false;

            LoreItem.items.forEach((registeredItem) => {
              if (itemStack!.typeId === registeredItem.config.id) {
                registeredItem.config.lines.forEach((loreLine) => {
                  if (!lore.includes(loreLine)) {
                    lore = [...registeredItem.config.lines, ...lore];
                    loreChanged = true;
                  }
                });
              }
            });

            if (globalLore && !lore.includes(productNameForLore)) {
              lore.push("", `${productNameForLore}`);
              loreChanged = true;
            }

            if (loreChanged) {
              itemStack.setLore(lore);
              container.setItem(i, itemStack);
            }
          }
        }
      });
    }, 1);
  }
}
