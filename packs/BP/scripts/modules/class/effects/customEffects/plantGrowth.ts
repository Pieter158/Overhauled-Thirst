import { Entity, Player, system, world } from "@minecraft/server";
import CustomVector3 from "../../../calc/vector3";
import { CustomEffect } from "../customEffect";

// Helper function to check if vector is valid
function isValidVector3(vec: { x: number; y: number; z: number }): boolean {
  return (
    typeof vec.x === "number" &&
    typeof vec.y === "number" &&
    typeof vec.z === "number" &&
    !isNaN(vec.x) &&
    !isNaN(vec.y) &&
    !isNaN(vec.z)
  );
}

// Helper function to get maximum growth stage for different crops
function getMaxGrowthStage(blockTypeId: string): number {
  const growthStages: { [key: string]: number } = {
    "minecraft:pumpkin_stem": 7,
    "minecraft:melon_stem": 7,
    "minecraft:beetroot": 7,
    "minecraft:wheat": 7,
    "minecraft:torchflower_crop": 1,
    "minecraft:carrots": 7,
    "minecraft:potatoes": 7,
    "minecraft:sweet_berry_bush": 3,
  };

  return growthStages[blockTypeId] ?? 7; // Default to 7 if not found
}

/**
 * Plant growth effect that accelerates crop growth in a radius around the player.
 * This effect is designed to run at intervals (default: every 20 ticks / 1 second)
 * rather than every tick to balance performance and gameplay.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function plantGrowth(
  target: Player | Entity,
  customEffect: CustomEffect
) {
  if (!(target instanceof Player)) return;

  const amplifier = customEffect.properties?.amplifier ?? 1;
  const range = amplifier * 3; // Scale range based on amplifier

  const playerLocation = CustomVector3.fromMC(target.location);
  if (!isValidVector3(playerLocation)) return;

  const dimension = target.dimension;

  for (let x = -range; x <= range; x++) {
    for (let y = -range; y <= range; y++) {
      for (let z = -range; z <= range; z++) {
        const blockLocation = {
          x: target.location.x + x,
          y: target.location.y + y,
          z: target.location.z + z,
        };

        const block = dimension.getBlock(blockLocation);
        if (!block) continue;

        const blockLocationVec = CustomVector3.fromMC(blockLocation);
        if (!isValidVector3(blockLocationVec)) continue;

        const distance = playerLocation.distanceTo(blockLocationVec);
        if (isNaN(distance) || distance > range) continue;

        // Check for vanilla minecraft growth state
        const vanillaGrowthState = block.permutation.getState("growth");
        if (vanillaGrowthState !== undefined) {
          const currentGrowth = vanillaGrowthState as number;
          const maxGrowth = getMaxGrowthStage(block.typeId);

          const locationCenter = {
            x: blockLocation.x + 0.5,
            y: blockLocation.y,
            z: blockLocation.z + 0.5,
          };

          if (currentGrowth < maxGrowth) {
            block.setPermutation(
              block.permutation.withState("growth", currentGrowth + 1)
            );
            block.dimension.spawnParticle(
              "minecraft:crop_growth_emitter",
              locationCenter
            );
            block.dimension.playSound("item.bone_meal.use", locationCenter);
          }
        }

        // Check for custom crop growth state (sb_ob:grow_state)
        const customGrowthState =
          block.permutation.getState("sb_ob:grow_state");
        if (customGrowthState !== undefined) {
          const currentGrowth = customGrowthState as number;
          // For custom crops, we need to determine max growth differently
          // This would need to be coordinated with your CropBlock system
          const maxGrowth = 4; // Default for most custom crops, adjust as needed

          const locationCenter = {
            x: blockLocation.x + 0.5,
            y: blockLocation.y,
            z: blockLocation.z + 0.5,
          };

          if (currentGrowth < maxGrowth) {
            block.setPermutation(
              block.permutation.withState("sb_ob:grow_state", currentGrowth + 1)
            );
            block.dimension.spawnParticle(
              "minecraft:crop_growth_emitter",
              locationCenter
            );
            block.dimension.playSound("item.bone_meal.use", locationCenter);
          }
        }
      }
    }
  }
}
