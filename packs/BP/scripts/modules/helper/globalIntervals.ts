import { system, world } from "@minecraft/server";

/**
 * A utility class for managing global intervals that run callbacks at specified tick intervals.
 * This class provides a centralized way to handle multiple timed callbacks without creating
 * separate system intervals for each one, improving performance.
 */
export class GlobalIntervals {
  private static intervals: {
    [interval: string]: { id: number; callback: (data: { tick: number; entry: number }) => void }[];
  } = {};

  /**
   * Initializes the global interval system. This should be called once at startup.
   * Creates a single system interval that manages all registered callbacks.
   */
  static initialize() {
    let tick = 0;
    system.runInterval(() => {
      tick++;
      if (tick > 999999) tick = 0; //just incase numbers do weird shit
      for (const stringInterval in this.intervals) {
        const intervalNum = JSON.parse(stringInterval) as number;
        for (let i = 0; i < this.intervals[stringInterval].length; i++) {
          const interval = this.intervals[stringInterval][i];
          if (
            tick - (i - Math.floor(i / intervalNum) * intervalNum) ==
            Math.floor(tick / intervalNum) * intervalNum
          )
            interval.callback({ tick: tick, entry: i });
        }
      }
    });
  }

  /**
   * Removes a callback from the global intervals system.
   * @param id - The unique identifier returned by the set() method
   */
  static clear(id: number) {
    for (const stringInterval in this.intervals) {
      const intervals = this.intervals[stringInterval];
      for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        if (interval.id !== id) continue;
        this.intervals[stringInterval].splice(i, 1);
        return;
      }
    }
  }

  /**
   * Registers a callback to be executed at regular intervals.
   * @param callback - The function to execute, receives tick and entry data
   * @param interval - The number of ticks between callback executions
   * @returns A unique identifier that can be used to clear the interval
   */
  static set(callback: (data: { tick: number; entry: number }) => void, interval: number): number {
    const floored = Math.floor(interval);
    let randomNum: undefined | number = undefined;
    while (randomNum === undefined) {
      const random = Math.floor(Math.random() * 999999999);
      if (this.intervals[`${floored}`]?.find((f) => f.id === random)) continue;
      randomNum = random;
    }
    if (!this.intervals[`${floored}`]) this.intervals[`${floored}`] = [];
    this.intervals[`${floored}`].push({ id: randomNum, callback: callback });
    return randomNum;
  }
}
