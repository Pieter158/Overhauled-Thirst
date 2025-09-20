import { Entity, Player, world, system } from "@minecraft/server";
import { applyEffect } from "../effectsManager";
import { fireEffect } from "../../../../config/customEffects";
import { CustomEffect } from "../customEffect";

// Track event subscriptions by entity ID to prevent duplicates
const activeSubscriptions = new Map<string, { unsubscribe: () => void }>();

export function fireEntityOnHit(target: Player | Entity, customEffect: CustomEffect) {
  // If this entity already has an active subscription, don't register another one
  if (activeSubscriptions.has(target.id)) {
    return;
  }

  // Subscribe to the event once for this entity
  const callback = world.afterEvents.entityHitEntity.subscribe((event) => {
    // Only apply the effect if the entity with the effect is the source
    if (event.damagingEntity && event.damagingEntity.id === target.id && event.hitEntity) {
      event.hitEntity.setOnFire(5); // Set the hit entity on fire for 5 seconds
      applyEffect(event.hitEntity, fireEffect);
    }
  });

  // Store the subscription so we can clean it up later
  activeSubscriptions.set(target.id, {
    unsubscribe: () => {
      world.afterEvents.entityHitEntity.unsubscribe(callback);
    },
  });

  // Set up cleanup when the effect ends
  if (customEffect.duration) {
    system.runTimeout(() => {
      const subscription = activeSubscriptions.get(target.id);
      if (subscription) {
        subscription.unsubscribe();
        activeSubscriptions.delete(target.id);
      }
    }, customEffect.duration * 20); // Convert seconds to ticks
  }
}
