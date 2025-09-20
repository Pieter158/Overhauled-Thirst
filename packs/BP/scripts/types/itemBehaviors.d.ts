// Central typings for item behaviors

import "../modules/itemModule";

declare module "../modules/itemModule" {
  interface ItemBehaviorProperties {
    potion?: {
      thirst?: number;
    };
    // Shorthand: allow using `thirst: number` directly
    thirst?: number;
  }
}
