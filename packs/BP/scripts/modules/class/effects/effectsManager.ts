import {
  EntityEffectOptions,
  EffectType,
  Entity,
  Player,
  system,
  world,
} from "@minecraft/server";
import { CustomEffect } from "./customEffect";
import { CustomEffectModule } from "./customEffect";
import { Animation } from "../animations";
import { namespace } from "../../../config/_config";
import { ChargeItem } from "../items/chargeItem";

export interface IntervalEffects {
  id: string;
  interval: number;
}
export interface EffectOptions {
  id: string;
  duration: number;
  effects?: {
    type: EffectType | string;
    duration: number;
    properties?: EntityEffectOptions;
  }[];
  customEffects?: CustomEffect[];
  visualEffects?: VisualEffects;
}
export interface VisualEffects {
  onStart?: {
    particles?: string[];
    sounds?: string[];
    animations?: (string | Animation)[];
  };
  onInterval?: {
    particles?: IntervalEffects[];
    sounds?: IntervalEffects[];
    animations?: (string | Animation)[];
  };
  onEnd?: {
    particles?: string[];
    sounds?: string[];
    animations?: (string | Animation)[];
  };
}
export interface BlockVisualEffects {
  onStart?: {
    particles?: string[];
    sounds?: string[];
  };
  onInterval?: {
    particles?: IntervalEffects[];
    sounds?: IntervalEffects[];
  };
  onEnd?: {
    particles?: string[];
    sounds?: string[];
  };
}
export interface ChargeVisualEffects {
  onStart?: {
    particles?: string[];
    sounds?: string[];
    animations?: (string | Animation)[];
  };
  onCharge?: {
    particles?: IntervalEffects[];
    sounds?: IntervalEffects[];
    animations?: (string | Animation)[];
  };
  onEnd?: {
    particles?: string[];
    sounds?: string[];
    animations?: (string | Animation)[];
  };
  onRelease?: {
    particles?: string[];
    sounds?: string[];
    animations?: (string | Animation)[];
  };
}

const targetEffectAnimationControllers = new Map<
  Player | Entity,
  Set<string>
>();
const ongoingEffects = new Map<
  Player | Entity,
  {
    particleIntervals: number[];
    soundIntervals: number[];
    effectDurations: Map<string, number>;
  }
>();
const scheduledEndEffects = new Map<Player | Entity, number[]>();
let effectsSystemInitialized = false;

export function emitEffects(
  effects: string[] | undefined,
  target: Player | Entity,
  effectType: "particle" | "sound"
) {
  if (!effects) return;

  effects.forEach((effect) => {
    if (effectType === "particle") {
      try {
        target.dimension.spawnParticle(effect, target.location);
      } catch (error) {}
    } else if (effectType === "sound") {
      try {
        target.dimension.playSound(effect, target.location);
      } catch (error) {}
    }
  });
}

export function playAnimations(
  animations: (string | Animation)[] | undefined,
  target: Player | Entity
) {
  if (!animations) return;
  if (target instanceof Player) {
    animations.forEach((animation) => {
      let controller = "default";
      if (typeof animation === "string") {
        target.playAnimation(animation, {});
      } else {
        const options = animation.options || {};
        controller = options.controller || "default";
        const stopExpression = options.stopExpression ?? "false";

        target.playAnimation(animation.animation, {
          ...options,
          controller,
          stopExpression,
        });
      }
      // Store the controller used for this target
      if (!targetEffectAnimationControllers.has(target)) {
        targetEffectAnimationControllers.set(target, new Set());
      }
      targetEffectAnimationControllers.get(target)?.add(controller);
    });
  }
}

export function resetAnimations(
  target: Player | Entity,
  blendOutTime: number = 0.5
) {
  const controllers = targetEffectAnimationControllers.get(target);
  if (target instanceof Player) {
    if (controllers) {
      controllers.forEach((controller) => {
        target.playAnimation(`animation.${namespace}.reset.third_person`, {
          blendOutTime: blendOutTime,
          stopExpression: "false",
          controller: controller,
        });
      });
      // Clear the stored controllers after resetting
      targetEffectAnimationControllers.delete(target);
    } else {
      // If no controllers are stored, use the default controller
      target.playAnimation(`animation.${namespace}.reset.third_person`, {
        blendOutTime: blendOutTime,
        stopExpression: "false",
        controller: "default",
      });
    }
  }
}

export function applyEffect(
  target: Player | Entity,
  effectOptions: EffectOptions
) {
  // Initialize the effects system if it hasn't been initialized yet
  if (!effectsSystemInitialized) {
    initializeEffectsSystem();
    effectsSystemInitialized = true;
  }

  if (effectOptions.effects) {
    effectOptions.effects.forEach((effect) => {
      target.addEffect(effect.type, effect.duration * 20, effect.properties);
    });
  }

  const totalDuration = effectOptions.duration * 20;
  const visualEffects = effectOptions.visualEffects;

  if (effectOptions.customEffects) {
    const customEffectModule = CustomEffectModule.getInstance();
    effectOptions.customEffects.forEach((customEffect) => {
      if (isCustomEffect(customEffect)) {
        customEffectModule.applyCustomEffect(
          target,
          customEffect,
          effectOptions.duration
        );
      } else {
        console.error("Invalid powerUp object", customEffect);
      }
    });
  }

  const effectId = effectOptions.id;
  if (!effectId) {
    console.error("EffectOptions must have an id");
    return;
  }

  const ongoingEffect = ongoingEffects.get(target) || {
    particleIntervals: [],
    soundIntervals: [],
    effectDurations: new Map<string, number>(),
  };

  // Update the duration if the same effect is applied again within its duration
  if (ongoingEffect.effectDurations.has(effectId)) {
    const remainingDuration = ongoingEffect.effectDurations.get(effectId) || 0;
    const newDuration = Math.max(remainingDuration, totalDuration);
    ongoingEffect.effectDurations.set(effectId, newDuration);
  } else {
    ongoingEffect.effectDurations.set(effectId, totalDuration);
  }

  ongoingEffects.set(target, ongoingEffect);

  if (visualEffects) {
    if (visualEffects.onStart) {
      emitEffects(visualEffects.onStart.particles, target, "particle");
      emitEffects(visualEffects.onStart.sounds, target, "sound");
      playAnimations(visualEffects.onStart.animations, target);
    }

    if (visualEffects.onInterval) {
      loopEffects(
        visualEffects.onInterval.particles,
        totalDuration,
        target,
        "particle"
      );
      loopEffects(
        visualEffects.onInterval.sounds,
        totalDuration,
        target,
        "sound"
      );
      playAnimations(visualEffects.onInterval.animations, target);
    }

    // Cancel any existing end effects before scheduling new ones
    cancelScheduledEndEffects(target);

    if (visualEffects.onEnd) {
      scheduleEffects(
        visualEffects.onEnd.particles,
        totalDuration,
        target,
        "particle"
      );
      scheduleEffects(
        visualEffects.onEnd.sounds,
        totalDuration,
        target,
        "sound"
      );
      scheduleAnimations(visualEffects.onEnd.animations, totalDuration, target);
    }
  }
}

function cancelScheduledEndEffects(target: Player | Entity) {
  const endEffectTimeoutIds = scheduledEndEffects.get(target);
  if (endEffectTimeoutIds) {
    endEffectTimeoutIds.forEach((timeoutId) => system.clearRun(timeoutId));
    scheduledEndEffects.delete(target);
  }
}

function isCustomEffect(obj: any): obj is CustomEffect {
  return obj && typeof obj === "object" && typeof obj.type === "string";
}

export function loopEffects(
  effects: { id: string; interval?: number }[] | undefined,
  totalDuration: number,
  target: Player | Entity,
  effectType: "particle" | "sound"
) {
  if (!effects) return;

  const intervals = ongoingEffects.get(target) || {
    particleIntervals: [],
    soundIntervals: [],
    effectDurations: new Map<string, number>(),
  };

  effects.forEach((effect) => {
    const interval = effect.interval || 0;
    const totalLoops = calculateTotalLoops(interval, totalDuration);
    for (let i = 0; i < totalLoops; i++) {
      const intervalId = system.runTimeout(
        () => emitEffect(effect.id, effectType, target),
        interval * i
      );
      if (effectType === "particle") {
        intervals.particleIntervals.push(intervalId);
      } else {
        intervals.soundIntervals.push(intervalId);
      }
    }
  });

  ongoingEffects.set(target, intervals);
}

export function loopChargeEffects(
  effects: { id: string; interval?: number }[] | undefined,
  target: Player,
  effectType: "particle" | "sound"
) {
  if (!effects) return;

  const intervals = ongoingEffects.get(target) || {
    particleIntervals: [],
    soundIntervals: [],
    effectDurations: new Map<string, number>(),
  };

  effects.forEach((effect) => {
    const interval = effect.interval || 20; // Default to 1 second if not specified
    const intervalId = system.runInterval(() => {
      if (ChargeItem.playerIsCharging.get(target)) {
        emitEffect(effect.id, effectType, target);
      } else {
        system.clearRun(intervalId);
      }
    }, interval);

    if (effectType === "particle") {
      intervals.particleIntervals.push(intervalId);
    } else {
      intervals.soundIntervals.push(intervalId);
    }
  });

  ongoingEffects.set(target, intervals);
}

export function scheduleEffects(
  effects: string[] | undefined,
  totalDuration: number,
  target: Player | Entity,
  effectType: "particle" | "sound"
) {
  if (!effects) return;

  const timeoutId = system.runTimeout(() => {
    emitEffects(effects, target, effectType);
  }, totalDuration);

  // Track scheduled end effects
  if (!scheduledEndEffects.has(target)) {
    scheduledEndEffects.set(target, []);
  }
  scheduledEndEffects.get(target)!.push(timeoutId);
}

export function scheduleAnimations(
  animations: (string | Animation)[] | undefined,
  totalDuration: number,
  target: Player | Entity
) {
  const timeoutId = system.runTimeout(() => {
    resetAnimations(target);
    playAnimations(animations, target);
  }, totalDuration + 5);

  // Track scheduled end effects for animations
  if (!scheduledEndEffects.has(target)) {
    scheduledEndEffects.set(target, []);
  }
  scheduledEndEffects.get(target)!.push(timeoutId);
}

export function calculateTotalLoops(interval: number, totalDuration: number) {
  return Math.floor(totalDuration / interval);
}

export function emitEffect(
  effectType: string,
  effect: "particle" | "sound",
  target: Player | Entity
) {
  if (effect === "particle") {
    try {
      target.dimension.spawnParticle(effectType, target.location);
    } catch (error) {}
  } else if (effect === "sound") {
    try {
      target.dimension.playSound(effectType, target.location);
    } catch (error) {}
  }
}

export function stopEffectsOnDeath() {
  world.afterEvents.entityDie.subscribe((event) => {
    const deadEntity = event.deadEntity;

    resetAnimations(deadEntity);
    const effects = ongoingEffects.get(deadEntity);
    if (effects) {
      effects.particleIntervals.forEach((intervalId) =>
        system.clearRun(intervalId)
      );
      effects.soundIntervals.forEach((intervalId) =>
        system.clearRun(intervalId)
      );
      ongoingEffects.delete(deadEntity);
    }

    // Clear any scheduled end effects
    const endEffectTimeoutIds = scheduledEndEffects.get(deadEntity);
    if (endEffectTimeoutIds) {
      endEffectTimeoutIds.forEach((timeoutId) => system.clearRun(timeoutId));
      scheduledEndEffects.delete(deadEntity);
    }
  });
}

// Call this function to initialize the effect system
export function initializeEffectsSystem() {
  if (!effectsSystemInitialized) {
    stopEffectsOnDeath();
    effectsSystemInitialized = true;
    // Add any other initialization logic here
  }
}
