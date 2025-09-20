import { Player } from "@minecraft/server";
import thirstConfig from "../../config/thirst/_index";

export function getThirst(player: Player): number {
  const v = player.getDynamicProperty("thirst");
  return typeof v === "number" ? v : thirstConfig.max;
}

export function setThirst(player: Player, value: number) {
  const clamped = Math.max(0, Math.min(thirstConfig.max, value));
  player.setDynamicProperty("thirst", clamped);
}

export function ensureThirst(player: Player) {
  if (typeof player.getDynamicProperty("thirst") !== "number") {
    setThirst(player, thirstConfig.max);
  }
}

export function addThirst(player: Player, delta: number) {
  ensureThirst(player);
  setThirst(player, getThirst(player) + delta);
}

export function showThirstTitle(player: Player) {
  player.onScreenDisplay.setTitle(`${thirstConfig.ui.titlePrefix}${getThirst(player)}`);
}
