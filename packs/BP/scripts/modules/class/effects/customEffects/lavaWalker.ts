import { Player, Entity, BlockPermutation, system } from "@minecraft/server";
import { CustomEffect } from "../customEffect";

/**
 * Lava Walker effect that creates basalt when walking on lava.
 * Blocks transition from basalt -> red concrete (warning) -> lava.
 * This gives players visual warning before blocks disappear.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function lavaWalker(target: Player | Entity, customEffect: CustomEffect) {
  if (!(target instanceof Player)) return;

  const amplifier = customEffect.properties?.amplifier ?? 1;
  const playerLocation = target.location;
  const dimension = target.dimension;

  // Check if player is standing on or near lava
  const feetLocation = {
    x: Math.floor(playerLocation.x),
    y: Math.floor(playerLocation.y), // Player's current Y level (feet)
    z: Math.floor(playerLocation.z),
  };

  // Define the radius based on amplifier (like enchantment)
  const radius = Math.min(1 + amplifier, 16); // Max radius of 16 like vanilla

  // Check blocks in a circular area around the player
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      // Calculate distance from center
      const distance = Math.sqrt(x * x + z * z);

      // Only affect blocks within the circular radius
      if (distance <= radius) {
        // Check both the block below feet and at feet level
        const checkLocations = [
          {
            x: feetLocation.x + x,
            y: feetLocation.y - 1, // Block below feet (original behavior)
            z: feetLocation.z + z,
          },
          {
            x: feetLocation.x + x,
            y: feetLocation.y - 2, // Block at feet level (for falling into lava)
            z: feetLocation.z + z,
          },
        ];

        for (const checkLocation of checkLocations) {
          const block = dimension.getBlock(checkLocation);
          if (!block) continue;

          // Check if it's lava or flowing lava
          if (block.typeId === "minecraft:lava" || block.typeId === "minecraft:flowing_lava") {
            // Store original block type for restoration
            const originalBlockType = block.typeId;

            // Always place basalt first (safe walking surface)
            try {
              block.setPermutation(BlockPermutation.resolve("minecraft:basalt"));

              // Schedule the transition sequence: basalt -> red concrete -> lava
              scheduleBlockTransition(dimension, checkLocation, originalBlockType);

              // Spawn some visual effects
              if (Math.random() < 0.3) {
                const effectLocation = {
                  x: checkLocation.x + 0.5,
                  y: checkLocation.y + 1.0,
                  z: checkLocation.z + 0.5,
                };

                dimension.spawnParticle("minecraft:lava_particle", effectLocation);

                // Play basalt/stone placing sound
                dimension.playSound("dig.stone", effectLocation, {
                  volume: 0.5,
                });
              }
            } catch (error) {
              // Skip this block if we can't place basalt
              continue;
            }
          }
        }
      }
    }
  }
}

/**
 * Schedule block transition sequence: basalt -> red concrete -> lava
 * This gives players visual warning before blocks disappear
 */
function scheduleBlockTransition(dimension: any, location: any, originalBlockType: string) {
  // Phase 1: Stay basalt for 10 seconds (200 ticks)
  system.runTimeout(() => {
    try {
      const block = dimension.getBlock(location);
      if (block && block.typeId === "minecraft:basalt") {
        // Change to red concrete as warning
        block.setPermutation(BlockPermutation.resolve("minecraft:magma"));

        // Spawn warning particle effect
        const effectLocation = {
          x: location.x + 0.5,
          y: location.y + 1.0,
          z: location.z + 0.5,
        };
        dimension.spawnParticle("minecraft:redstone_dust_particle", effectLocation);
        dimension.playSound("block.note_block.bell", effectLocation, {
          volume: 0.3,
        });
      }
    } catch (error) {
      // Block might not exist anymore, ignore error
    }
  }, 200); // 10 seconds

  // Phase 2: Revert to lava after additional 5 seconds (100 ticks)
  system.runTimeout(() => {
    try {
      const block = dimension.getBlock(location);
      if (block && block.typeId === "minecraft:magma") {
        // Revert back to original lava type
        block.setPermutation(BlockPermutation.resolve(originalBlockType));

        // Optional: spawn particle effect when reverting
        const effectLocation = {
          x: location.x + 0.5,
          y: location.y + 1.0,
          z: location.z + 0.5,
        };
        dimension.spawnParticle("minecraft:lava_particle", effectLocation);
      }
    } catch (error) {
      // Block might not exist anymore, ignore error
    }
  }, 300); // Total 15 seconds (10 + 5)
}
