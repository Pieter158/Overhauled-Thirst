import { ItemStack, system, world } from "@minecraft/server";
import ScriptingModule from "./scriptingModule";
import { namespace, startItems, startSound } from "../config/_config";
import { addItemToInventory } from "./helper/utils";

export default class PlayerJoinModule extends ScriptingModule {
  constructor() {
    super("PlayerJoinModule");
  }

  public onInitialize(): void {
    world.afterEvents.playerSpawn.subscribe((event) => {
      const player = event.player;

      if (player.hasTag(`${namespace}:has_joined`)) return;

      system.runTimeout(() => {
        player.sendMessage({ translate: `${namespace}.joined.first_time` });
        player.playSound(`${startSound}`);
      }, 100);
      startItems.forEach((item) => {
        if (item === null) return;
        const itemStack = new ItemStack(item);
        addItemToInventory(player, itemStack);
      });
      player.addTag(`${namespace}:has_joined`);
    });
  }
}
