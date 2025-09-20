import { Player, system, Entity } from "@minecraft/server";
import { registerCustomEffects } from "../../../config/customEffects";
import CustomVector3 from "../../calc/vector3";
// import ScriptingModule from "../../scriptingModule"; // Not needed if we don't rely on ScriptingModule
// Removed import { registerCustomEffects } since we now rely on CustomEffectRegistry

export interface CustomEffect {
  type: string;
  duration?: number;
  properties?: {
    amplifier?: number;
    showParticles?: boolean;
    interval?: number; // Interval in ticks between effect applications
  };
}

type CustomEffectHandler = (
  target: Player | Entity,
  effect: CustomEffect
) => void;

export class CustomEffectRegistry {
  private static effectHandlers = new Map<
    string,
    { handler: CustomEffectHandler; defaultInterval?: number }
  >();

  public static registerEffect(
    effectId: string,
    handler: CustomEffectHandler,
    defaultInterval?: number
  ): void {
    if (this.effectHandlers.has(effectId)) {
      console.warn(`Effect '${effectId}' is already registered.`);
      return;
    }
    this.effectHandlers.set(effectId, { handler, defaultInterval });
  }

  public static getAllEffectHandlers(): Map<
    string,
    { handler: CustomEffectHandler; defaultInterval?: number }
  > {
    return this.effectHandlers;
  }
}

export class CustomEffectModule {
  private static instance: CustomEffectModule;
  private activeCustomEffects = new Map<
    Player | Entity,
    Map<string, { effect: CustomEffect; timeoutId: number; lastTick: number }>
  >();
  private initialized = false;

  // Instead of hardcoding handlers, we get them from the CustomEffectRegistry
  private effectData: Map<
    string,
    { handler: CustomEffectHandler; defaultInterval?: number }
  > = new Map();

  public static getInstance(): CustomEffectModule {
    if (!CustomEffectModule.instance) {
      CustomEffectModule.instance = new CustomEffectModule();
    }
    return CustomEffectModule.instance;
  }

  public initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Load all custom effects from the CustomEffectRegistry
    this.effectData = CustomEffectRegistry.getAllEffectHandlers();

    registerCustomEffects();

    // Register tick event once
    system.runInterval(() => {
      this.onTick();
    }, 1);
  }

  public applyCustomEffect(
    target: Player | Entity,
    customEffect: CustomEffect,
    globalDuration: number
  ) {
    this.initialize(); // Ensure initialization is done

    const defaultCustomEffect: CustomEffect = {
      type: customEffect.type,
      duration: customEffect.duration ?? globalDuration,
      properties: {
        amplifier: customEffect.properties?.amplifier ?? 1,
        showParticles: customEffect.properties?.showParticles ?? false,
      },
    };

    if (!this.activeCustomEffects.has(target)) {
      this.activeCustomEffects.set(target, new Map());
    }

    const currentEffects = this.activeCustomEffects.get(target)!;
    if (currentEffects.has(customEffect.type)) {
      const existingEffect = currentEffects.get(customEffect.type)!;
      system.clearRun(existingEffect.timeoutId); // Clear the existing timeout
      const newDuration = Math.max(
        existingEffect.effect.duration!,
        defaultCustomEffect.duration!
      );
      defaultCustomEffect.duration = newDuration;
    }

    const timeoutId = system.runTimeout(() => {
      this.removeCustomEffect(target, customEffect.type);
    }, defaultCustomEffect.duration! * 20);

    currentEffects.set(customEffect.type, {
      effect: defaultCustomEffect,
      timeoutId,
      lastTick: 0,
    });
  }

  private removeCustomEffect(
    target: Player | Entity,
    customEffectType: string
  ) {
    const currentEffects = this.activeCustomEffects.get(target);
    if (currentEffects && currentEffects.has(customEffectType)) {
      system.clearRun(currentEffects.get(customEffectType)!.timeoutId); // Clear the timeout
      currentEffects.delete(customEffectType);
    }
  }

  public isCustomEffectActive(
    player: Player | Entity,
    customEffectType: string
  ): boolean {
    return this.activeCustomEffects.get(player)?.has(customEffectType) ?? false;
  }

  public getCustomEffectProperties(
    player: Player | Entity,
    customEffectType: string
  ): CustomEffect | undefined {
    return this.activeCustomEffects.get(player)?.get(customEffectType)?.effect;
  }

  /**
   * Called every tick (20 times per second). It checks all active custom effects on all players/entities
   * and applies their per-tick logic if defined, respecting their intervals.
   */
  private onTick(): void {
    const currentTick = system.currentTick;

    for (const [entity, effectsMap] of this.activeCustomEffects.entries()) {
      for (const [effectType, effectInfo] of effectsMap.entries()) {
        const effectData = this.effectData.get(effectType);
        if (!effectData) continue;

        const { handler, defaultInterval } = effectData;
        const { effect, lastTick } = effectInfo;

        // Get interval from effect properties or use default
        const interval = effect.properties?.interval ?? defaultInterval ?? 1;

        // Check if enough ticks have passed since last execution
        if (currentTick - lastTick >= interval) {
          handler(entity, effect);
          effectInfo.lastTick = currentTick;
        }
      }
    }
  }
}
