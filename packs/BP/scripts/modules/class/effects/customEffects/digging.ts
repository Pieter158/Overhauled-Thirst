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

// Store players with the digging effect and their last break time
const playersWithEffect = new Map<string, number>();

// Array of all Minecraft shovel variants + custom deepshard shovel
const shovelTypes = [
  "minecraft:wooden_shovel",
  "minecraft:stone_shovel",
  "minecraft:iron_shovel",
  "minecraft:golden_shovel",
  "minecraft:diamond_shovel",
  "minecraft:netherite_shovel",
  "sb_th:deepshard_shovel",
  "sb_th:deepshard_shovel",
];

/**
 * Digging effect that breaks a 3x3x3 area of shovel-destructible blocks when digging with any shovel.
 * Only triggers when the player is actively breaking blocks, not when looking at them.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function digging(target: Player | Entity, customEffect: CustomEffect) {
  if (!(target instanceof Player)) return;

  const player = target;
  const playerId = player.id;
  const amplifier = customEffect.properties?.amplifier ?? 1;

  // Store the player as having the effect
  playersWithEffect.set(playerId, Date.now());

  // This effect runs continuously but only does the excavation logic on block break
  // The actual excavation is handled in the playerBreakBlock event listener below
}

// Subscribe to the playerBreakBlock event for the digging effect
world.afterEvents.playerBreakBlock.subscribe((event) => {
  const block = event.block;
  const player = event.player;
  const dimension = block.dimension;
  const brokenBlockPermutation = event.brokenBlockPermutation;

  if (!(player instanceof Player)) return;

  // Check if player has the digging effect
  if (!playersWithEffect.has(player.id)) return;

  // Check if player is holding any shovel
  const item = getItemInSlot(player, EquipmentSlot.Mainhand);
  if (!item || !shovelTypes.includes(item.typeId)) return;

  // Check if the broken block is shovel-destructible
  let validForShovel = false;

  // Check by tags first (more efficient)
  if (
    brokenBlockPermutation.hasTag("minecraft:is_shovel_item_destructible") ||
    brokenBlockPermutation.hasTag("dirt") ||
    brokenBlockPermutation.hasTag("sand") ||
    brokenBlockPermutation.hasTag("gravel") ||
    brokenBlockPermutation.hasTag("snow")
  ) {
    validForShovel = true;
  }

  if (!validForShovel) return;

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

          // Check if target block is shovel-destructible
          if (
            targetBlock.hasTag("minecraft:is_shovel_item_destructible") ||
            targetBlock.hasTag("dirt") ||
            targetBlock.hasTag("sand") ||
            targetBlock.hasTag("gravel") ||
            targetBlock.hasTag("snow")
          ) {
            shouldBreak = true;
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

  world.sendMessage(
    `3x3x3 grondgebied uitgegraven rond ${centerX}, ${centerY}, ${centerZ}`
  );
});

// Clean up players when they leave
world.afterEvents.playerLeave.subscribe((event) => {
  playersWithEffect.delete(event.playerId);
});

// Periodic cleanup to remove players who no longer have the digging effect
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

      // Check if player still has the digging custom effect active
      const hasDiggingEffect = customEffectModule.isCustomEffectActive(
        player,
        "digging"
      );

      if (!hasDiggingEffect) {
        // Player no longer has the effect, remove from map
        playersWithEffect.delete(playerId);
        world.sendMessage(`§aDigging effect ended for ${player.name}`);
      }
    } catch (error) {
      // If there's an error checking the player, remove them from the map
      playersWithEffect.delete(playerId);
    }
  }
}, 100); // Check every 5 seconds (100 ticks)
