import { Player, world } from "@minecraft/server";
import { addThirst, showThirstTitle } from "../../helper/thirst";

export class PotionItem {
  static entries: { id: string; thirst: number }[] = [];

  static registerBehavior(config: {
    id: string;
    thirst?: number;
    value?: number;
  }) {
    const thirst = config.thirst ?? config.value ?? 0;
    this.entries.push({ id: config.id, thirst });
  }

  static initialize() {
    world.afterEvents.itemCompleteUse.subscribe((evd) => {
      const player = evd.source as Player;
      const stack = evd.itemStack;
      if (!player || !stack) return;
      const entry = this.entries.find((e) => e.id === stack.typeId);
      if (!entry) return;
      if (entry.thirst) {
        addThirst(player, entry.thirst);
        showThirstTitle(player);
      }
    });
  }
}
