import {
  Player,
  Entity,
  world,
  EquipmentSlot,
  system,
} from "@minecraft/server";
import { CustomEffect, CustomEffectModule } from "../customEffect";

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

// Store players with the stone excavator effect and their last break time
const playersWithEffect = new Map<string, number>();

// Array of all Minecraft pickaxe variants
const pickaxeTypes = [
  "minecraft:wooden_pickaxe",
  "minecraft:stone_pickaxe",
  "minecraft:iron_pickaxe",
  "minecraft:golden_pickaxe",
  "minecraft:diamond_pickaxe",
  "minecraft:netherite_pickaxe",
  "sb_th:deepshard_pickaxes",
];

// Array of custom stone blocks from block_set.json
const customStoneBlocks = [
  // Custom stone variants
  "sb_th:limestone",
  "sb_th:limestone_bricks",
  "sb_th:polished_limestone",
  "sb_th:thin_limestone_bricks",
  "sb_th:andesite_bricks",
  "sb_th:calcite_bricks",
  "sb_th:diorite_bricks",
  "sb_th:granite_bricks",
  "sb_th:ice_bricks",
  // Custom ores and materials
  "sb_th:cobalt_ore",
  "sb_th:ruby_ore",
  "sb_th:deepshard_crystal",
  "sb_th:fungal_deepslate",
];

/**
 * Stone Excavator effect that breaks a 3x3x3 area of stone blocks when mining with any pickaxe.
 * Only triggers when the player is actively breaking blocks, not when looking at them.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function stoneExcavator(
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

// Subscribe to the playerBreakBlock event for the stone excavator effect
world.afterEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  const player = event.player;
  const dimension = block.dimension;
  const brokenBlockPermutation = event.brokenBlockPermutation;

  if (!(player instanceof Player)) return;

  // Check if player has the stone excavator effect
  if (!playersWithEffect.has(player.id)) return;

  // Check if player is holding any pickaxe
  const item = getItemInSlot(player, EquipmentSlot.Mainhand);
  if (!item || !pickaxeTypes.includes(item.typeId)) return;

  // Check if the broken block is pickaxe-destructible
  let validForPickaxe = false;

  // Check by tags first (more efficient)
  if (
    brokenBlockPermutation.hasTag("minecraft:is_pickaxe_item_destructible") ||
    brokenBlockPermutation.hasTag("stone") ||
    brokenBlockPermutation.hasTag("metal")
  ) {
    validForPickaxe = true;
  } else {
    // Check specific custom stone blocks
    validForPickaxe = customStoneBlocks.includes(
      brokenBlockPermutation.type.id
    );
  }

  if (!validForPickaxe) return;

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

          // Check if target block is pickaxe-destructible
          if (
            targetBlock.hasTag("minecraft:is_pickaxe_item_destructible") ||
            targetBlock.hasTag("stone") ||
            targetBlock.hasTag("metal")
          ) {
            shouldBreak = true;
          } else {
            // Check specific custom stone blocks
            shouldBreak = customStoneBlocks.includes(targetBlock.typeId);
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

// Periodic cleanup to remove players who no longer have the stone excavator effect
system.runInterval(() => {
  const customEffectModule = CustomEffectModule.getInstance();

  for (const [playerId] of playersWithEffect.entries()) {
    try {
      const player = world.getPlayers().find((p) => p.id === playerId);
      if (!player) {
        // Player is not online, remove from map
        playersWithEffect.delete(playerId);
        continue;
      }

      // Check if player still has the stone excavator custom effect active
      const hasStoneExcavatorEffect = customEffectModule.isCustomEffectActive(
        player,
        "stone_excavator"
      );

      if (!hasStoneExcavatorEffect) {
        // Player no longer has the effect, remove from map
        playersWithEffect.delete(playerId);
      }
    } catch (error) {
      // If there's an error checking the player, remove them from the map
      playersWithEffect.delete(playerId);
    }
  }
}, 100); // Check every 5 seconds (100 ticks)
