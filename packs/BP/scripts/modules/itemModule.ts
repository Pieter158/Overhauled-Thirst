import ScriptingModule from "./scriptingModule";
import { registerItems } from "../config/items";

// Use ItemBehaviorProperties to allow dynamic property extensions
export interface ItemBehaviorProperties {}

export class ItemBehavior {
  // Registry to store item behaviors by their key
  static registry: { [key: string]: any } = {};

  // Register item with behaviors using the dynamic ItemBehaviorProperties
  static register(config: { id: string } & Partial<ItemBehaviorProperties>) {
    const { id } = config;
    Object.keys(config).forEach((key) => {
      const BehaviorClass = this.registry[key];
      if (
        BehaviorClass &&
        typeof BehaviorClass.registerBehavior === "function"
      ) {
        const behaviorConfig = config[
          key as keyof ItemBehaviorProperties
        ] as any;
        if (behaviorConfig !== undefined && behaviorConfig !== null) {
          if (typeof behaviorConfig === "object") {
            BehaviorClass.registerBehavior({ id, ...behaviorConfig });
          } else {
            // Allow primitive values like: { thirst: 5 }
            BehaviorClass.registerBehavior({ id, value: behaviorConfig });
          }
        }
      }
    });
  }

  // Register subclasses dynamically (either by string or class)
  static registerSubclass<T extends keyof ItemBehaviorProperties>(
    typeOrClass: T | (new () => any),
    subclass?: any
  ): void {
    if (typeof typeOrClass === "string") {
      this.registry[typeOrClass] = subclass;
    } else {
      const className = typeOrClass.name.toLowerCase();
      this.registry[className] = typeOrClass;
    }
  }

  // Initialize registered behaviors
  static initialize(): void {
    Object.entries(this.registry).forEach(([key, BehaviorClass]) => {
      if (typeof BehaviorClass.initialize === "function") {
        BehaviorClass.initialize();
      }
    });
  }
}

export default class ItemModule extends ScriptingModule {
  constructor() {
    super("ItemModule");
  }

  public onInitialize(): void {
    registerItems();
  }
}
