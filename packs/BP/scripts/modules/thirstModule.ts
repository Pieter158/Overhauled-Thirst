import { Player, system, world } from "@minecraft/server";
import ScriptingModule from "./scriptingModule";
import { GlobalIntervals } from "./helper/globalIntervals";
import thirstConfig from "../config/thirst/_index";
import {
  ensureThirst,
  getThirst,
  setThirst,
  showThirstTitle,
} from "./helper/thirst";

export default class ThirstModule extends ScriptingModule {
  constructor() {
    super("ThirstModule");
  }

  private static readonly MAX_THIRST = thirstConfig.max;
  private static readonly MIN_TICKS = thirstConfig.decay.minTicks;
  private static readonly MAX_TICKS = thirstConfig.decay.maxTicks;
  private static readonly TICK_STEP = thirstConfig.decay.step;

  private decayCounters = new Map<string, number>();
  private nauseaCounters = new Map<string, number>();
  private starveCounters = new Map<string, number>();

  private getThirst = getThirst;
  private setThirst = setThirst;
  private ensureThirst = ensureThirst;
  private updateThirstTitle = showThirstTitle;

  private randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Item-based thirst changes are now handled via item behaviors in config/items.ts

  onInitialize(): void {
    // Start global interval driver if not already started
    GlobalIntervals.initialize();

    world.afterEvents.playerSpawn.subscribe((evd) => {
      const player = evd.player;
      if (evd.initialSpawn) {
        if (typeof player.getDynamicProperty("thirst") !== "number") {
          this.setThirst(player, ThirstModule.MAX_THIRST);
        }
      } else {
        // Respawn after death: reset thirst to max
        this.setThirst(player, ThirstModule.MAX_THIRST);
        // Reset counters so effects start clean after respawn
        this.nauseaCounters.delete(player.id);
        this.starveCounters.delete(player.id);
      }
      this.updateThirstTitle(player);
      this.decayCounters.set(
        player.id,
        this.randomInt(ThirstModule.MIN_TICKS, ThirstModule.MAX_TICKS)
      );
    });

    world.afterEvents.playerLeave.subscribe((evd) => {
      this.decayCounters.delete(evd.playerId);
      this.nauseaCounters.delete(evd.playerId);
      this.starveCounters.delete(evd.playerId);
    });

    // Item consumption is handled by PotionItem behavior; no listener needed here

    // Global tick driver: per-player counters
    GlobalIntervals.set(() => {
      const players = world.getAllPlayers();
      const present = new Set(players.map((p) => p.id));

      for (const p of players) {
        this.ensureThirst(p);
        let remaining = this.decayCounters.get(p.id);
        if (remaining === undefined)
          remaining = this.randomInt(
            ThirstModule.MIN_TICKS,
            ThirstModule.MAX_TICKS
          );
        remaining -= ThirstModule.TICK_STEP;
        if (remaining <= 0) {
          if (this.getThirst(p) > 0) {
            this.setThirst(p, this.getThirst(p) - 1);
            this.updateThirstTitle(p);
          }
          remaining = this.randomInt(
            ThirstModule.MIN_TICKS,
            ThirstModule.MAX_TICKS
          );
        }
        this.decayCounters.set(p.id, remaining);

        // Additional effects based on thirst level
        const thirst = this.getThirst(p);

        // When thirst <= 4: periodically apply nausea for 5 seconds
        if (thirst <= 4) {
          let nCounter = this.nauseaCounters.get(p.id);
          if (nCounter === undefined) {
            nCounter = this.randomInt(500, 1200);
          }
          nCounter -= ThirstModule.TICK_STEP;
          if (nCounter <= 0) {
            // 10 seconds = 200 ticks
            try {
              (p as Player).addEffect("nausea", 200, {
                amplifier: 3,
                showParticles: true,
              } as any);
            } catch {}
            nCounter = this.randomInt(500, 1200);
          }
          this.nauseaCounters.set(p.id, nCounter);
        } else {
          // Clear counter when above threshold so we re-roll when dipping again
          this.nauseaCounters.delete(p.id);
        }

        // When thirst == 0: every 5 seconds deal half-heart damage (1)
        if (thirst === 0) {
          let sCounter = this.starveCounters.get(p.id);
          if (sCounter === undefined) sCounter = 100; // 5s at 20 tps
          sCounter -= ThirstModule.TICK_STEP;
          if (sCounter <= 0) {
            try {
              (p as Player).applyDamage?.(1);
            } catch {}
            sCounter = 100;
          }
          this.starveCounters.set(p.id, sCounter);
        } else {
          this.starveCounters.delete(p.id);
        }
      }

      for (const id of [...this.decayCounters.keys()])
        if (!present.has(id)) this.decayCounters.delete(id);
      for (const id of [...this.nauseaCounters.keys()])
        if (!present.has(id)) this.nauseaCounters.delete(id);
      for (const id of [...this.starveCounters.keys()])
        if (!present.has(id)) this.starveCounters.delete(id);
    }, ThirstModule.TICK_STEP);
  }
}
