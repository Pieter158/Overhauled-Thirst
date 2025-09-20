import { Entity, Player } from "@minecraft/server";
import {
  CustomEffect,
  CustomEffectRegistry,
} from "../modules/class/effects/customEffect";
import { EffectOptions } from "../modules/class/effects/effectsManager";
import { fireEntityOnHit } from "../modules/class/effects/customEffects/fireOnHit";
import { freezeEntityOnHit } from "../modules/class/effects/customEffects/freezeEntityOnHit";
import { pullEntitiesTowardsPlayer } from "../modules/class/effects/customEffects/pullEntitiesTowardsPlayer";
import { plantGrowth } from "../modules/class/effects/customEffects/plantGrowth";
import { swimSpeed } from "../modules/class/effects/customEffects/swimSpeed";
import { frostWalker } from "../modules/class/effects/customEffects/frostWalker";
import { lavaWalker } from "../modules/class/effects/customEffects/lavaWalker";
import { doubleJump } from "../modules/class/effects/customEffects/doubleJump";
import { stoneExcavator } from "../modules/class/effects/customEffects/stoneExcavator";
import { lumberjack } from "../modules/class/effects/customEffects/lumberjack";
import { digging } from "../modules/class/effects/customEffects/digging";

export function registerCustomEffects() {
  // Pull entities effect - runs every tick for smooth movement
  CustomEffectRegistry.registerEffect(
    "pull_entities",
    pullEntitiesTowardsPlayer,
    1
  );

  // Event-based effects - no interval needed as they respond to events
  CustomEffectRegistry.registerEffect(
    "freeze_entity_on_hit",
    freezeEntityOnHit
  );
  CustomEffectRegistry.registerEffect("fire_entity_on_hit", fireEntityOnHit);

  // Plant growth effect - runs every 20 ticks (1 second) for performance
  CustomEffectRegistry.registerEffect("plant_growth", plantGrowth, 20);

  // Swim speed effect - runs every 10 ticks for responsive underwater movement
  CustomEffectRegistry.registerEffect("swim_speed", swimSpeed, 1);

  // Frost walker effect - runs every 5 ticks for responsive ice creation
  CustomEffectRegistry.registerEffect("frost_walker", frostWalker, 5);

  // Lava walker effect - runs every 5 ticks for responsive basalt creation
  CustomEffectRegistry.registerEffect("lava_walker", lavaWalker, 1);

  // Double jump effect - runs every 2 ticks for responsive jump detection
  CustomEffectRegistry.registerEffect("double_jump", doubleJump, 2);

  // Stone excavator effect - runs every 20 ticks (1 second) for mining blocks
  CustomEffectRegistry.registerEffect("stone_excavator", stoneExcavator, 20);

  // Lumberjack effect - runs every 20 ticks (1 second) for chopping wood blocks
  CustomEffectRegistry.registerEffect("lumberjack", lumberjack, 20);

  // Digging effect - runs every 20 ticks (1 second) for digging with shovels
  CustomEffectRegistry.registerEffect("digging", digging, 20);
}

/*
 * INTERVAL SYSTEM USAGE:
 *
 * When registering effects, you can specify a default interval:
 * - registerEffect("effect_name", handler, interval_in_ticks)
 * - Interval is optional; if not provided, defaults to 1 (every tick)
 *
 * You can also override intervals in individual effect configurations:
 * customEffects: [{
 *   type: "plant_growth",
 *   properties: {
 *     amplifier: 2,
 *     interval: 40  // Override to run every 2 seconds instead of 1
 *   }
 * }]
 *
 * Common intervals:
 * - 1 tick = 20 times per second (smooth effects like movement)
 * - 5 ticks = 4 times per second (frequent updates)
 * - 20 ticks = 1 second (balanced performance)
 * - 60 ticks = 3 seconds (slow, performance-friendly)
 */

export const freezeEffect: EffectOptions = {
  id: "freeze_entity",
  effects: [
    {
      type: "minecraft:slowness",
      duration: 5,
      properties: {
        amplifier: 5,
        showParticles: false,
      },
    },
  ],
  visualEffects: {
    onStart: {
      sounds: ["sb_th:freeze.hit"],
    },
    onInterval: {
      particles: [
        {
          id: "sb_th:freeze.hit",
          interval: 2,
        },
      ],
    },
  },
  duration: 5,
};

export const fireEffect: EffectOptions = {
  id: "fire",
  duration: 5,
  visualEffects: {
    onStart: {
      sounds: ["sb_th:fire.hit"],
    },
    onInterval: {
      particles: [
        {
          id: "sb_th:fire.hit",
          interval: 2,
        },
      ],
    },
  },
};

export const pullEntitiesEffect: EffectOptions = {
  id: "pull_entities",
  duration: 3, // 10 seconds of entity pulling
  visualEffects: {
    onStart: {
      particles: ["minecraft:wind_explosion_particle"],
    },
    onInterval: {
      particles: [
        {
          id: "minecraft:portal_particle",
          interval: 10, // Every 0.5 seconds show portal particles around player
        },
      ],
      sounds: [
        {
          id: "sb_th:magnetism",
          interval: 10,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "pull_entities",
      properties: {
        amplifier: 1, // Pull strength
        interval: 1, // Every tick for smooth pulling movement
      },
    },
  ],
};

export const plantGrowthEffect: EffectOptions = {
  id: "plant_growth",
  duration: 30,
  visualEffects: {
    onStart: {
      particles: ["sb_th:plant_growth_start"],
      sounds: ["sb_th:plant_growth.start"],
    },
    onInterval: {
      particles: [
        {
          id: "sb_th:plant_growth_interval",
          interval: 3,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "plant_growth",
      properties: {
        amplifier: 1,
        interval: 20, // Override default interval - every 20 ticks (1 second)
      },
    },
  ],
};

// Example of a faster plant growth effect for creative mode or special items
export const rapidPlantGrowthEffect: EffectOptions = {
  id: "rapid_plant_growth",
  duration: 15,
  visualEffects: {
    onStart: {
      particles: ["sb_th:rapid_plant_growth_start"],
      sounds: ["sb_th:rapid_plant_growth.start"],
    },
    onInterval: {
      particles: [
        {
          id: "sb_th:rapid_plant_growth_interval",
          interval: 1,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "plant_growth",
      properties: {
        amplifier: 2,
        interval: 5, // Every 5 ticks (4 times per second) for rapid growth
      },
    },
  ],
};
export const freezeEntityOnHitEffect: EffectOptions = {
  id: "freeze_entity_on_hit",
  duration: 10,
  visualEffects: {
    onStart: {
      particles: ["sb_th:freeze_ability_start"],
      sounds: ["sb_th:freeze_ability.start"],
    },
    onInterval: {
      particles: [
        {
          id: "sb_th:freeze_ability_interval",
          interval: 1,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "freeze_entity_on_hit",
      properties: {
        amplifier: 1,
      },
    },
  ],
};

export const fireEntityOnHitEffect: EffectOptions = {
  id: "fire_entity_on_hit",
  duration: 10,
  visualEffects: {
    onStart: {
      particles: ["sb_th:fire_ability_start"],
      sounds: ["sb_th:fire_ability.start"],
    },
    onInterval: {
      particles: [
        {
          id: "sb_th:fire_ability_interval",
          interval: 1,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "fire_entity_on_hit",
      properties: {
        amplifier: 1,
      },
    },
  ],
};

export const swimSpeedEffect: EffectOptions = {
  id: "swim_speed",
  duration: 20,
  visualEffects: {
    onStart: {
      particles: ["minecraft:water_splash_particle"],
      sounds: ["ambient.weather.rain"],
    },
    onInterval: {
      particles: [
        {
          id: "minecraft:bubble_particle",
          interval: 2,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "swim_speed",
      properties: {
        amplifier: 2,
        interval: 10, // Every 10 ticks for responsive swimming
      },
    },
  ],
};

export const frostWalkerEffect: EffectOptions = {
  id: "frost_walker",
  duration: 120,
  visualEffects: {
    onStart: {
      particles: ["minecraft:snowflake_particle"],
      sounds: ["block.glass.break"],
    },
    onInterval: {
      particles: [
        {
          id: "minecraft:snowflake_particle",
          interval: 20,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "frost_walker",
      properties: {
        amplifier: 1, // Determines ice radius
        interval: 5, // Every 5 ticks for responsive ice creation
      },
    },
  ],
};

export const lavaWalkerEffect: EffectOptions = {
  id: "lava_walker",
  duration: 120,
  visualEffects: {
    onStart: {
      particles: ["minecraft:lava_particle"],
      sounds: ["ambient.nether.mood"],
    },
    onInterval: {
      particles: [
        {
          id: "minecraft:flame_particle",
          interval: 15,
        },
      ],
    },
  },
  customEffects: [
    {
      type: "lava_walker",
      properties: {
        amplifier: 1, // Determines basalt radius
        interval: 5, // Every 5 ticks for responsive basalt creation
      },
    },
  ],
};

export const doubleJumpEffect: EffectOptions = {
  id: "double_jump",
  duration: 30, // 30 seconds of double jump ability
  visualEffects: {
    onStart: {
      particles: ["minecraft:wind_explosion_particle"],
      sounds: ["mob.enderdragon.flap"],
    },
    onInterval: {
      particles: [
        {
          id: "minecraft:cloud_particle",
          interval: 40, // Every 2 seconds show cloud particles around player
        },
      ],
    },
  },
  customEffects: [
    {
      type: "double_jump",
      properties: {
        amplifier: 1, // Jump strength multiplier
        interval: 2, // Every 2 ticks for responsive jump detection
      },
    },
  ],
};

export const stoneExcavatorEffect: EffectOptions = {
  id: "stone_excavator",
  duration: 60, // 60 seconds of enhanced mining
  customEffects: [
    {
      type: "stone_excavator",
      properties: {
        amplifier: 1, // Mining power multiplier
        interval: 20, // Every 20 ticks (1 second) for balanced mining
      },
    },
  ],
};

export const lumberjackEffect: EffectOptions = {
  id: "lumberjack",
  duration: 60, // 60 seconds of enhanced chopping
  customEffects: [
    {
      type: "lumberjack",
      properties: {
        amplifier: 1, // Chopping power multiplier
        interval: 20, // Every 20 ticks (1 second) for balanced chopping
      },
    },
  ],
};

export const diggingEffect: EffectOptions = {
  id: "digging",
  duration: 60, // 60 seconds of enhanced digging
  customEffects: [
    {
      type: "digging",
      properties: {
        amplifier: 1, // Digging power multiplier
        interval: 20, // Every 20 ticks (1 second) for balanced digging
      },
    },
  ],
};
