import { Player, Entity, world } from "@minecraft/server";
import CustomVector3 from "../../../calc/vector3";
import { CustomEffect } from "../customEffect"; // Adjust the import as needed

// Example function to show validity checks for vectors
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

/**
 * Tick handler for a "pull_items" effect that pulls dropped items towards the player.
 */
export function pullEntitiesTowardsPlayer(
  target: Player | Entity,
  customEffect: CustomEffect
) {
  if (!(target instanceof Player)) return;

  const amplifier = customEffect.properties?.amplifier ?? 1;
  const range = amplifier * 10;

  const playerLocation = CustomVector3.fromMC(target.location);
  if (!isValidVector3(playerLocation)) return;

  const dimension = target.dimension;
  const entities = dimension.getEntities({
    type: "minecraft:item",
    location: playerLocation,
    maxDistance: range,
  });

  for (const entity of entities) {
    // Skip if entity is not an item
    if (entity.typeId !== "minecraft:item") continue;

    const entityLocation = CustomVector3.fromMC(entity.location);
    if (!isValidVector3(entityLocation)) continue;

    const distance = playerLocation.distanceTo(entityLocation);
    if (isNaN(distance) || distance > range) continue;

    const direction = playerLocation.subtract(entityLocation).normalize();
    if (!isValidVector3(direction)) continue;

    const velocity = direction.multiply(0.1);
    if (!isValidVector3(velocity)) return;

    // Apply impulse to pull the item towards the player
    entity.applyImpulse(velocity);
  }
}
