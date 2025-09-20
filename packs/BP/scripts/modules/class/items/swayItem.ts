import { ItemComponentUseEvent, ItemComponentUseOnEvent, system, world } from "@minecraft/server";
import { namespace } from "../../../config/_config";

export class SwayItem {
  static initialize() {
    system.beforeEvents.startup.subscribe((event) => {
      event.itemComponentRegistry.registerCustomComponent(`${namespace}:sway`, {
        onUseOn(event: ItemComponentUseOnEvent) {
        }
      });
    });


  }
}
