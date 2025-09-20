import { Player, Entity, BlockPermutation, system } from "@minecraft/server";
import { CustomEffect } from "../customEffect";

/**
 * Frost Walker effect that creates frosted ice when walking on water.
 * Works exactly like the Minecraft Frost Walker enchantment but as a custom effect.
 * Ice blocks melt after 10 seconds.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function frostWalker(target: Player | Entity, customEffect: CustomEffect) {
  if (!(target instanceof Player)) return;

  const amplifier = customEffect.properties?.amplifier ?? 1;
  const playerLocation = target.location;
  const dimension = target.dimension;

  // Check if player is standing on or near water
  const feetLocation = {
    x: Math.floor(playerLocation.x),
    y: Math.floor(playerLocation.y), // Player's current Y level (feet)
    z: Math.floor(playerLocation.z),
  };

  // Define the radius based on amplifier (like enchantment)
  const radius = Math.min(2 + amplifier, 16); // Max radius of 16 like vanilla

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
            y: feetLocation.y, // Block at feet level (for falling into water)
            z: feetLocation.z + z,
          },
        ];

        for (const checkLocation of checkLocations) {
          const block = dimension.getBlock(checkLocation);
          if (!block) continue;

          // Check if it's water or flowing water
          if (block.typeId === "minecraft:water" || block.typeId === "minecraft:flowing_water") {
            // Place frosted ice
            try {
              block.setPermutation(BlockPermutation.resolve("minecraft:frosted_ice"));

              // Schedule the ice to melt after 10 seconds (200 ticks)
              scheduleFrostMelt(dimension, checkLocation, 200);
            } catch (error) {
              // If frosted_ice doesn't exist, use regular ice
              try {
                block.setPermutation(BlockPermutation.resolve("minecraft:ice"));
                scheduleFrostMelt(dimension, checkLocation, 200);
              } catch (iceError) {
                // Fallback - skip this block if we can't place ice
                continue;
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Schedule ice block to melt back to water after a delay
 */
function scheduleFrostMelt(dimension: any, location: any, ticks: number) {
  system.runTimeout(() => {
    try {
      const block = dimension.getBlock(location);
      if (block && (block.typeId === "minecraft:frosted_ice" || block.typeId === "minecraft:ice")) {
        // Melt back to water
        block.setPermutation(BlockPermutation.resolve("minecraft:water"));
      }
    } catch (error) {
      // Block might not exist anymore, ignore error
    }
  }, ticks);
}
