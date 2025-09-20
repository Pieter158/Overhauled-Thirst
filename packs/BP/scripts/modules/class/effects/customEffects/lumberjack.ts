import {
  Player,
  Entity,
  world,
  EquipmentSlot,
  system,
} from "@minecraft/server";
import { CustomEffect } from "../customEffect";

/**
 * Utility function to get the item in the player's selected slot.
 */
function getItemInSlot(player: Player, slot: EquipmentSlot) {
  const equippableComponent = player.getComponent(
    "minecraft:equippable"
  ) as any;
  if (!equippableComponent) return undefined;
  return equippableComponent.getEquipment(slot);
}

// Store players with the lumberjack effect and their last break time
const playersWithEffect = new Map<string, number>();

// Array of all Minecraft axe variants
const axeTypes = [
  "minecraft:wooden_axe",
  "minecraft:stone_axe",
  "minecraft:iron_axe",
  "minecraft:golden_axe",
  "minecraft:diamond_axe",
  "minecraft:netherite_axe",
  "sb_th:deepshard_axe",
];

// Array of wood-related blocks (both vanilla and custom)
const woodBlocks = [
  // Vanilla wood blocks
  "minecraft:oak_log",
  "minecraft:birch_log",
  "minecraft:spruce_log",
  "minecraft:jungle_log",
  "minecraft:acacia_log",
  "minecraft:dark_oak_log",
  "minecraft:mangrove_log",
  "minecraft:cherry_log",
  "minecraft:crimson_stem",
  "minecraft:warped_stem",
  "minecraft:stripped_oak_log",
  "minecraft:stripped_birch_log",
  "minecraft:stripped_spruce_log",
  "minecraft:stripped_jungle_log",
  "minecraft:stripped_acacia_log",
  "minecraft:stripped_dark_oak_log",
  "minecraft:stripped_mangrove_log",
  "minecraft:stripped_cherry_log",
  "minecraft:stripped_crimson_stem",
  "minecraft:stripped_warped_stem",
  "minecraft:oak_wood",
  "minecraft:birch_wood",
  "minecraft:spruce_wood",
  "minecraft:jungle_wood",
  "minecraft:acacia_wood",
  "minecraft:dark_oak_wood",
  "minecraft:mangrove_wood",
  "minecraft:cherry_wood",
  "minecraft:crimson_hyphae",
  "minecraft:warped_hyphae",
  "minecraft:stripped_oak_wood",
  "minecraft:stripped_birch_wood",
  "minecraft:stripped_spruce_wood",
  "minecraft:stripped_jungle_wood",
  "minecraft:stripped_acacia_wood",
  "minecraft:stripped_dark_oak_wood",
  "minecraft:stripped_mangrove_wood",
  "minecraft:stripped_cherry_wood",
  "minecraft:stripped_crimson_hyphae",
  "minecraft:stripped_warped_hyphae",
  // Custom wood blocks from tree_set.json
  "sb_th:willow_log",
  "sb_th:willow_wood",
  "sb_th:stripped_willow_log",
  "sb_th:stripped_willow_wood",
  "sb_th:willow_planks",
  "sb_th:willow_slab",
  "sb_th:willow_stairs",
  "sb_th:redwood_log",
  "sb_th:redwood_wood",
  "sb_th:stripped_redwood_log",
  "sb_th:stripped_redwood_wood",
  "sb_th:redwood_planks",
  "sb_th:redwood_slab",
  "sb_th:redwood_stairs",
  "sb_th:pine_log",
  "sb_th:pine_wood",
  "sb_th:stripped_pine_log",
  "sb_th:stripped_pine_wood",
  "sb_th:pine_planks",
  "sb_th:pine_slab",
  "sb_th:pine_stairs",
  "sb_th:rain_forest_log",
  "sb_th:rain_forest_wood",
  "sb_th:stripped_rain_forest_log",
  "sb_th:stripped_rain_forest_wood",
  "sb_th:rain_forest_planks",
  "sb_th:rain_forest_slab",
  "sb_th:rain_forest_stairs",
  "sb_th:baobab_log",
  "sb_th:baobab_wood",
  "sb_th:stripped_baobab_log",
  "sb_th:stripped_baobab_wood",
  "sb_th:baobab_planks",
  "sb_th:baobab_slab",
  "sb_th:baobab_stairs",
  "sb_th:maple_log",
  "sb_th:maple_wood",
  "sb_th:stripped_maple_log",
  "sb_th:stripped_maple_wood",
  "sb_th:maple_planks",
  "sb_th:maple_slab",
  "sb_th:maple_stairs",
  "sb_th:palm_log",
  "sb_th:palm_wood",
  "sb_th:stripped_palm_log",
  "sb_th:stripped_palm_wood",
  "sb_th:palm_planks",
  "sb_th:palm_slab",
  "sb_th:palm_stairs",
];

/**
 * Lumberjack effect that breaks a 3x3x3 area of wood blocks when chopping with any axe.
 * Only triggers when the player is actively breaking blocks, not when looking at them.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function lumberjack(
  target: Player | Entity,
  customEffect: CustomEffect
) {
  if (!(target instanceof Player)) return;

  const player = target;
  const playerId = player.id;
  const amplifier = customEffect.properties?.amplifier ?? 1;

  // Store the player as having the effect
  playersWithEffect.set(playerId, Date.now());

  // This effect runs continuously but only does the excavation logic on block break
  // The actual excavation is handled in the playerBreakBlock event listener below
}

// Subscribe to the playerBreakBlock event for the lumberjack effect
world.afterEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  const player = event.player;
  const dimension = block.dimension;
  const brokenBlockPermutation = event.brokenBlockPermutation;

  if (!(player instanceof Player)) return;

  // Check if player has the lumberjack effect
  if (!playersWithEffect.has(player.id)) return;

  // Check if player is holding any axe
  const item = getItemInSlot(player, EquipmentSlot.Mainhand);
  if (!item || !axeTypes.includes(item.typeId)) return;

  // Check if the broken block is wood-related (either by tags or specific blocks)
  let validForAxe = false;

  // Check by tags first (more efficient)
  if (
    brokenBlockPermutation.hasTag("wood") ||
    brokenBlockPermutation.hasTag("log") ||
    brokenBlockPermutation.hasTag("minecraft:is_axe_item_destructible")
  ) {
    validForAxe = true;
  } else {
    // Check specific block types for custom blocks
    validForAxe = woodBlocks.includes(brokenBlockPermutation.type.id);
  }

  if (!validForAxe) return;

  const centerX = block.location.x;
  const centerY = block.location.y;
  const centerZ = block.location.z;

  // Define the excavation area (3x3x3)
  const radius = 1;

  for (let x = -radius; x <= radius; x++) {
    for (let y = -radius; y <= radius; y++) {
      for (let z = -radius; z <= radius; z++) {
        // Skip the center block (already broken)
        if (x === 0 && y === 0 && z === 0) continue;

        const targetLocation = {
          x: centerX + x,
          y: centerY + y,
          z: centerZ + z,
        };

        const targetBlock = dimension.getBlock(targetLocation);
        if (targetBlock) {
          let shouldBreak = false;

          // Check if target block is wood-related
          if (
            targetBlock.hasTag("wood") ||
            targetBlock.hasTag("log") ||
            targetBlock.hasTag("minecraft:is_axe_item_destructible")
          ) {
            shouldBreak = true;
          } else {
            // Check specific block types for custom blocks
            shouldBreak = woodBlocks.includes(targetBlock.typeId);
          }

          if (shouldBreak) {
            player.runCommand(
              `setblock ${targetLocation.x} ${targetLocation.y} ${targetLocation.z} air destroy`
            );
          }
        }
      }
    }
  }
});

// Clean up players when they leave
world.afterEvents.playerLeave.subscribe((event) => {
  playersWithEffect.delete(event.playerId);
});

// Import the custom effect module to check if players still have the effect
import { CustomEffectModule } from "../customEffect";

// Periodic cleanup to remove players who no longer have the lumberjack effect
system.runInterval(() => {
  const currentTime = Date.now();
  const customEffectModule = CustomEffectModule.getInstance();

  for (const [playerId, startTime] of playersWithEffect.entries()) {
    try {
      const player = world.getPlayers().find((p) => p.id === playerId);
      if (!player) {
        // Player is not online, remove from map
        playersWithEffect.delete(playerId);
        continue;
      }

      // Check if player still has the lumberjack custom effect active
      const hasLumberjackEffect = customEffectModule.isCustomEffectActive(
        player,
        "lumberjack"
      );

      if (!hasLumberjackEffect) {
        // Player no longer has the effect, remove from map
        playersWithEffect.delete(playerId);
      }
    } catch (error) {
      // If there's an error checking the player, remove them from the map
      playersWithEffect.delete(playerId);
    }
  }
}, 100); // Check every 5 seconds (100 ticks)
