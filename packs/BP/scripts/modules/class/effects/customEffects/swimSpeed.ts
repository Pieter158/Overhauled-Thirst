import { Player, Entity, Block } from "@minecraft/server";
import { CustomEffect } from "../customEffect";

/**
 * Swim speed effect that increases swimming speed when in water.
 * Also provides speed boost when standing on wet blocks.
 *
 * @param target - The player with the effect
 * @param customEffect - The custom effect configuration
 */
export function swimSpeed(target: Player | Entity, customEffect: CustomEffect) {
  if (!(target instanceof Player)) return;

  const amplifier = customEffect.properties?.amplifier ?? 1;
  const dimension = target.dimension;

  if (target.isInWater) {
    if (!target.isSwimming) return;

    const speed = 0.5 + amplifier * 0.2; // Scale speed with amplifier
    const differenceThreshold = 0.75;
    const velocity = target.getVelocity();
    const total = Math.abs(velocity.x) + Math.abs(velocity.z);

    if (total === 0) return; // Avoid division by zero

    const direction = { x: velocity.x / total, z: velocity.z / total };
    const viewDir = target.getViewDirection();
    const difference = Math.abs(viewDir.x - direction.x) + Math.abs(viewDir.z - direction.z);

    target.applyKnockback({ x: difference < differenceThreshold ? direction.x : viewDir.x, z: difference < differenceThreshold ? direction.z : viewDir.z }, viewDir.y * (speed * 0.5)
    );

    // Apply water breathing for convenience
    if (!target.getEffect("water_breathing")) {
      target.addEffect("water_breathing", 200, {
        amplifier: 0,
        showParticles: false,
      });
    }

    // Spawn water particles for visual feedback
    if (Math.random() < 0.2) {
      const particleLocation = {
        x: target.location.x + (Math.random() - 0.5),
        y: target.location.y + Math.random() * 0.5,
        z: target.location.z + (Math.random() - 0.5),
      };

      dimension.spawnParticle("minecraft:bubble_particle", particleLocation);
    }
  } else if (target.isOnGround) {
    let belowBlock: Block | undefined = undefined;
    const loc = target.location;
    loc.y -= 0.2;

    try {
      belowBlock = dimension.getBlock(loc);
    } catch {}

    const wetBlocks = [
      "minecraft:mud",
      "minecraft:bubble_coral_block",
      "minecraft:fire_coral_block",
      "minecraft:horn_coral_block",
      "minecraft:brain_coral_block",
      "minecraft:tube_coral_block",
    ];

    if (!belowBlock || !wetBlocks.includes(belowBlock.typeId)) return;

    target.addEffect("speed", 5, {
      amplifier: amplifier, // Use effect amplifier
      showParticles: false,
    });
  }
}
