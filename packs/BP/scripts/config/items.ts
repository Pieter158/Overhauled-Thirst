import {
  BlockPermutation,
  Dimension,
  Entity,
  EntityDamageCause,
  EntityTypeFamilyComponent,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  world,
} from "@minecraft/server";
import { EventItem } from "../modules/class/items/eventItem";
import { ItemBehavior } from "../modules/itemModule";
import {
  addItemToInventory,
  decreaseItemAmountInHand,
  decreaseItemDurabilityInHand,
  getCardinalDirection,
  getItemCountInInventory,
  removeItemFromInventory,
  setItemInSlot,
} from "../modules/helper/utils";
import FormModule from "../modules/formModule";
import {
  nonSolidBlocks,
  transparentBlocks,
} from "../modules/helper/blockTypes";
import { applyEffect } from "../modules/class/effects/effectsManager";
import { swimSpeedEffect } from "./customEffects";
import { LoreItem } from "../modules/class/items/loreItem";
import { DurabilityItem } from "../modules/class/items/durabilityItem";
import { PotionItem } from "../modules/class/items/potionItem";
import { addThirst, showThirstTitle } from "../modules/helper/thirst";

export function registerItems() {
  ItemBehavior.registerSubclass("events", EventItem);
  ItemBehavior.registerSubclass("lore", LoreItem);
  ItemBehavior.registerSubclass("durability", DurabilityItem);
  // Register "thirst" as alias for PotionItem so you can use: { thirst: 5 }
  ItemBehavior.registerSubclass("potion", PotionItem);
  ItemBehavior.registerSubclass("thirst", PotionItem);

  ItemBehavior.register({
    id: "minecraft:apple",
    events: {
      onCompleteUse: (player: Player) => {
        applyEffect(player, swimSpeedEffect);
      },
    },
  });

  // Thirst-related: generic vanilla potion adds thirst
  ItemBehavior.register({
    id: "minecraft:potion",
    thirst: 5,
  });

  // FLASK items (ported from wildlife-style):
  // - sb_th:flask_full.1 → on drink: +thirst and convert to empty
  // - sb_th:flask_empty → on use on water/cauldron: convert to full

  // Full flask: drinking restores thirst and leaves an empty flask
  ItemBehavior.register({
    id: "sb_th:flask_full.1",
    thirst: 5,
    lore: { lines: ["§7(3/3)"] },
    events: {
      onCompleteUse: (player: Player) => {
        // Ensure HUD updates and convert to empty
        showThirstTitle(player);
        setItemInSlot(
          player,
          EquipmentSlot.Mainhand,
          new ItemStack("sb_th:flask_full.2", 1)
        );
      },
    },
  });
  ItemBehavior.register({
    id: "sb_th:flask_full.2",
    thirst: 5,
    lore: { lines: ["§7(2/3)"] },
    events: {
      onCompleteUse: (player: Player) => {
        // Ensure HUD updates and convert to empty
        showThirstTitle(player);
        setItemInSlot(
          player,
          EquipmentSlot.Mainhand,
          new ItemStack("sb_th:flask_full.3", 1)
        );
      },
    },
  });
  ItemBehavior.register({
    id: "sb_th:flask_full.3",
    thirst: 5,
    lore: { lines: ["§7(1/3)"] },
    events: {
      onCompleteUse: (player: Player) => {
        // Ensure HUD updates and convert to empty
        showThirstTitle(player);
        setItemInSlot(
          player,
          EquipmentSlot.Mainhand,
          new ItemStack("sb_th:flask_empty", 1)
        );
      },
    },
  });

  // Empty flask: fill from water source or water cauldron
  ItemBehavior.register({
    id: "sb_th:flask_empty",
    lore: { lines: ["§7(0/3)"] },
    events: {
      onUseOnBlockAfter: (event) => {
        const blockId = event.block.typeId;
        if (
          blockId === "minecraft:water" ||
          blockId === "minecraft:water_cauldron"
        ) {
          setItemInSlot(
            event.player as Player,
            EquipmentSlot.Mainhand,
            new ItemStack("sb_th:flask_full.1", 1)
          );
        }
      },
    },
  });
  ItemBehavior.initialize();
}
