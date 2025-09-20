import {
  Entity,
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  Player,
  GameMode,
  EntityInventoryComponent,
  ItemDurabilityComponent,
  Vector3,
  world,
  EntityTypeFamilyComponent,
  EnchantmentTypes,
  ItemComponentTypes,
  ItemEnchantableComponent,
  Dimension,
  Enchantment,
  EnchantmentType,
  RawText,
  system,
} from "@minecraft/server";
import { bundleTypes } from "./blockTypes";
import CustomVector3 from "../calc/vector3";

export interface SoundOptions {
  id: string;
  volume?: number;
  pitch?: number;
  range?: number;
}

system.beforeEvents.startup.subscribe(() => {
  system.run(() => {
    Dimensions["overworld"] = world.getDimension("overworld");
    Dimensions["nether"] = world.getDimension("nether");
    Dimensions["the_end"] = world.getDimension("the_end");
  });
});

export const Dimensions: { [string: string]: Dimension } = {};

export function randomNum(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function applyKnockbackFromEntity(
  source: Entity,
  entity: Entity,
  velocity: { xz: number; y: number }
) {
  const sourceLoc = source.location;
  const entityLoc = entity.location;
  const total = Math.abs(sourceLoc.x - entityLoc.x) + Math.abs(sourceLoc.z - entityLoc.z);
  const direction = {
    x: (entityLoc.x - sourceLoc.x) / total,
    z: (entityLoc.z - sourceLoc.z) / total,
  };
  try {
    entity.applyKnockback({ x: direction.x, z: direction.z }, velocity.y);
  } catch {}
}

/**
 * Retrieves the item in the specified equipment slot for a player.
 * @param player - The player entity.
 * @param slot - The equipment slot to retrieve the item from.
 * @returns The item in the specified equipment slot, or undefined if no item is found.
 */
export function getItemInSlot(entity: Entity, slot: EquipmentSlot): ItemStack | undefined {
  const equippableComponent = entity.getComponent(
    "minecraft:equippable"
  ) as EntityEquippableComponent;
  if (!equippableComponent) return undefined;
  return equippableComponent.getEquipment(slot);
}

/**
 * Sets an item in the specified equipment slot for a player.
 *
 * @param player - The player entity.
 * @param slot - The equipment slot to set the item in.
 * @param itemStack - The item stack to set in the slot. If not provided, the slot will be cleared.
 */
export function setItemInSlot(player: Player, slot: EquipmentSlot, itemStack?: ItemStack): void {
  const equippableComponent = player.getComponent(
    "minecraft:equippable"
  ) as EntityEquippableComponent;
  equippableComponent.setEquipment(slot, itemStack);
}

interface AddItemToInventoryOptions {
  spawnOffset?: Vector3;
  spawnCallback?: (entity: Entity) => void;
}
/**
 * Adds an item to the inventory of an entity.
 * If the entity's inventory is full, it will drop the excess items on the ground.
 * @param entity - The entity to add the item to.
 * @param itemStack - The item stack to add to the inventory.
 * @param options - Additional options for adding the item to the inventory.
 */
export function addItemToInventory(
  entity: Entity,
  itemStack: ItemStack,
  options?: AddItemToInventoryOptions
) {
  const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
  const container = inventory?.container;
  if (!container) {
    entity.dimension.spawnItem(itemStack, entity.location);
    return;
  }
  if (inventory.container.emptySlotsCount === 0) {
    let spaceRemaining = 0;
    for (let slotId = 0; slotId < container.size; slotId++) {
      const slot = container.getSlot(slotId);
      if (slot.getItem()?.typeId === itemStack.typeId) {
        spaceRemaining += Math.max(slot.maxAmount - slot.amount, 0);
        if (spaceRemaining >= itemStack.amount) break;
      }
    }
    const overflowAmount = itemStack.amount - spaceRemaining;
    if (overflowAmount > 0) {
      const droppedStack = itemStack.clone();
      droppedStack.amount = overflowAmount;

      const spawnLocation: Vector3 = entity.location;
      if (options?.spawnOffset) {
        spawnLocation.x += options.spawnOffset.x;
        spawnLocation.y += options.spawnOffset.y;
        spawnLocation.z += options.spawnOffset.z;
      }

      const itemEntity = entity.dimension.spawnItem(droppedStack, spawnLocation);
      options?.spawnCallback?.(itemEntity);
    }
  }
  inventory.container.addItem(itemStack);
}

/**
 * Removes a specified number of items from the player's inventory.
 * @param entity The player or entity whose inventory is being modified.
 * @param itemId The ID of the item to remove (e.g., "minecraft:raw_iron").
 * @param count The number of items to remove (optional, default is 1).
 * @returns Whether the item removal was successful.
 */
export function removeItemFromInventory(
  entity: Entity,
  itemId: string,
  count: number = 1,
  ignoreInCreative?: boolean
): boolean {
  const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
  const container = inventory?.container;

  // Check for creative mode exemption
  if (entity instanceof Player && ignoreInCreative && entity.getGameMode() === GameMode.Creative) {
    return true; // Skip removal in creative mode if specified and return success
  }

  if (!container) return false;

  let remainingToRemove = count;

  for (let slotId = 0; slotId < container.size; slotId++) {
    const slot = container.getSlot(slotId);
    const item = slot.getItem();

    if (item?.typeId === itemId) {
      if (item.amount > remainingToRemove) {
        // We have enough items in this slot to fulfill the request
        item.amount -= remainingToRemove;
        slot.setItem(item);
        return true;
      } else {
        // Take all from this slot and continue if needed
        remainingToRemove -= item.amount;
        slot.setItem(undefined);

        if (remainingToRemove <= 0) {
          return true;
        }
      }
    }
  }

  // Return true only if we removed all requested items
  return remainingToRemove <= 0;
}

export interface DecreaseItemDurabilityInHandOptions {
  ignoreInCreative?: boolean;
  destructionSound?: string;
  convertInto?: string;
}
/**
 * Decreases the durability of the item in the player's hand.
 *
 * @param player - The player whose item durability needs to be decreased.
 * @param options - Optional parameters for decreasing item durability.
 * @returns A boolean indicating whether the item durability was decreased.
 */

export function decreaseItemDurabilityInHand(
  player: Player,
  options?: DecreaseItemDurabilityInHandOptions
): boolean {
  const ignoreInCreative = !(options?.ignoreInCreative === false);
  if (ignoreInCreative && player.getGameMode() === GameMode.Creative) return true;

  const item = getItemInSlot(player, EquipmentSlot.Mainhand);
  const durability = item?.getComponent("minecraft:durability") as
    | ItemDurabilityComponent
    | undefined;

  if (item && durability) {
    let unbreakingLevel: number;
    const enchantments = item.getComponent("minecraft:enchantable") as ItemEnchantableComponent;
    if (enchantments) {
      unbreakingLevel = enchantments.getEnchantment("minecraft:unbreaking")?.level ?? 0;
    } else {
      unbreakingLevel = 0;
    }

    const chance: number = 1 / (1 + unbreakingLevel);

    // Randomly decide if durability decreases
    if (Math.random() < chance) {
      if (durability.damage === durability.maxDurability) {
        setItemInSlot(
          player,
          EquipmentSlot.Mainhand,
          options?.convertInto ? new ItemStack(options.convertInto, item.amount) : undefined
        );
        player.dimension.playSound(options?.destructionSound || "random.break", player.location);
      } else {
        durability.damage++;
        setItemInSlot(player, EquipmentSlot.Mainhand, item);
      }
      return true;
    }
  }
  return false;
}

/**
 * Decrease the amount of the item in the player's mainhand
 * @param player The event data of the player
 * @param amount The amount to decrease
 * @param ignoreInCreative If true, the item amount will not be decreased
 *                         if the player is in creative mode
 * @returns True if the item amount was decreased, false otherwise.
 *          Always returns true if ignoreInCreative is true and the player is in creative mode.
 */
export function decreaseItemAmountInHand(
  player: Player,
  amount: number = 1,
  ignoreInCreative: boolean = false
): boolean {
  if (ignoreInCreative && player.getGameMode() === GameMode.Creative) return true;
  const item = getItemInSlot(player, EquipmentSlot.Mainhand);
  if (item) {
    if (item.amount > amount) {
      item.amount -= amount;
      setItemInSlot(player, EquipmentSlot.Mainhand, item);
    } else {
      setItemInSlot(player, EquipmentSlot.Mainhand, undefined);
    }
    return true;
  }
  return false;
}

/**
 * Emits a particle on the specified target entity at the given offset.
 * @param targetEntity - The target entity on which to emit the particle.
 * @param particleIdentifier - The identifier of the particle to emit.
 * @param offset - The offset at which to emit the particle relative to the target entity's location.
 */
export function emitParticleOnEntity(
  targetEntity: Entity,
  particleIdentifier: string,
  offset: Vector3
): void {
  const location = {
    x: targetEntity.location.x + offset.x,
    y: targetEntity.location.y + offset.y,
    z: targetEntity.location.z + offset.z,
  };

  (targetEntity.dimension as Entity["dimension"]).spawnParticle(particleIdentifier, location);
}

/**
 * Emits a sound on the specified entity at an offset location.
 * @param targetEntity - The target entity on which to emit the sound.
 * @param soundIdentifier - The identifier of the sound to emit.
 * @param offset - The offset location at which to emit the sound.
 */
export function emitSoundOnEntity(
  targetEntity: Entity,
  soundIdentifier: string,
  offset: Vector3
): void {
  const location = {
    x: targetEntity.location.x + offset.x,
    y: targetEntity.location.y + offset.y,
    z: targetEntity.location.z + offset.z,
  };

  (targetEntity.dimension as Entity["dimension"]).playSound(soundIdentifier, location);
}

export interface EntityFilter {
  isFamily?: string[];
  include: string[] | "all";
  exclude?: string[];
}

/**
 * Filters an entity based on the provided options.
 * @param entity - The entity to filter.
 * @param options - The filtering options.
 * @returns A boolean indicating whether the entity passes the filter.
 */
export function filterEntities(entity: Entity, options: EntityFilter): boolean {
  const entityType = entity.id;
  const typeFamilyComponent = entity.getComponent(
    "minecraft:type_family"
  ) as EntityTypeFamilyComponent;

  if (!typeFamilyComponent) {
    return false;
  }

  const familyTypes = typeFamilyComponent.getTypeFamilies();

  if (options.include !== "all" && !options.include.includes(entityType)) {
    return false;
  }

  if (options.exclude && options.exclude.includes(entityType)) {
    return false;
  }

  if (options.isFamily && !options.isFamily.some((family) => familyTypes.includes(family))) {
    return false;
  }

  return true;
}

// Get the cardinal direction based on the player's view direction
export function getCardinalDirection(viewDirection: Vector3): string {
  const { x, z } = viewDirection;

  // Determine the cardinal direction (north, south, east, west)
  if (Math.abs(x) > Math.abs(z)) {
    return x > 0 ? "east" : "west";
  } else {
    return z > 0 ? "south" : "north";
  }
}

/**
 * Get a random number within the specified range
 * @param min The lowest possible value
 * @param max The highest possible value
 * @returns A random number between `min` and `max`
 */
export function getRandomRange(min: number, max: number): number {
  if (min > max) throw new RangeError("min cannot be greater than max");
  return (max - min) * Math.random() + min;
}

export function getCenterOfBlock(location: Vector3) {
  const centerLocation = {
    x: location.x + 0.5,
    y: location.y,
    z: location.z + 0.5,
  };
  return centerLocation;
}

/**
 * Get the total number of a specific item type in the player's inventory.
 * @param player The player whose inventory is being checked.
 * @param itemTypeId The item type ID to search for (e.g., "minecraft:raw_iron").
 * @returns The total count of the specified item type in the player's inventory.
 */
export function getItemCountInInventory(entity: Entity, itemTypeId: string): number {
  let itemCount = 0;

  // Get the player's inventory
  const inventory = entity.getComponent("minecraft:inventory") as EntityInventoryComponent;

  // Iterate through each slot in the player's inventory
  for (let i = 0; i < inventory.inventorySize; i++) {
    const item = inventory.container?.getItem(i);

    // If the item in the slot matches the itemTypeId, add its count to the total
    if (item && item.typeId === itemTypeId) {
      itemCount += item.amount; // Add the amount of the item to the total count
    }
  }

  return itemCount;
}



export function saveInventory(entity: Entity, invName: string) {
  const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
  let container = inventory.container;
  if (!container) return;
  let inventorySize = container.size;

  const items: (null | { typeId: string; props: any; lore: string[]; components: any })[] = [];
  const listOfEquipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"] as string[];
  let wornArmor: (null | { typeId: string; props: any; lore: string[]; components: any })[] = [];

  for (let i = 0; i < listOfEquipmentSlots.length; i++) {
    const equippable = entity.getComponent("equippable") as EntityEquippableComponent;
    if (!equippable) continue;
    const equipment = equippable.getEquipment(listOfEquipmentSlots[i] as EquipmentSlot);

    if (!equipment) {
      wornArmor.push(null);
      continue;
    }

    const data = {
      typeId: equipment.typeId,
      props: {
        amount: equipment.amount,
        keepOnDeath: equipment.keepOnDeath,
        lockMode: equipment.lockMode,
        nameTag: equipment.nameTag,
      },
      lore: equipment.getLore(),
      components: {} as any,
    };

    if (equipment.nameTag) data.props.nameTag = equipment.nameTag;

    if (equipment.hasComponent("enchantable")) {
      const enchantableComponent = equipment.getComponent(
        "enchantable"
      ) as ItemEnchantableComponent;
      if (enchantableComponent) {
        data.components.enchantable = enchantableComponent
          .getEnchantments()
          .map((e: Enchantment) => ({ type: e.type.id, level: e.level }));
      }
    }

    if (equipment.hasComponent("durability")) {
      const durabilityComponent = equipment.getComponent("durability") as ItemDurabilityComponent;
      data.components.durability = durabilityComponent.damage;
    }
    wornArmor.push(data);
  }
  world.setDynamicProperty(`armor:${invName}`, JSON.stringify(wornArmor));

  for (let i = 0; i < inventorySize; i++) {
    const item = container.getItem(i);
    if (!item) {
      items.push(null);
      continue;
    }
    const data = {
      typeId: item.typeId,
      props: {
        amount: item.amount,
        keepOnDeath: item.keepOnDeath,
        lockMode: item.lockMode,
        nameTag: item.nameTag,
      },
      lore: item.getLore(),
      components: {} as any,
    };

    if (item.nameTag) data.props.nameTag = item.nameTag;

    if (item.hasComponent("enchantable")) {
      const enchantableComponent = item.getComponent("enchantable") as ItemEnchantableComponent;
      if (enchantableComponent) {
        data.components.enchantable = enchantableComponent
          .getEnchantments()
          .map((e: Enchantment) => ({ type: e.type.id, level: e.level }));
      }
    }

    if (item.hasComponent("durability")) {
      const durabilityComponent = item.getComponent("durability") as ItemDurabilityComponent;
      data.components.durability = durabilityComponent.damage;
    }

    items.push(data);
  }
  world.setDynamicProperty(`inventory:${invName}`, JSON.stringify(items));
  return { items, wornArmor };
}

export function loadInventory(entity: Entity, invName: string) {
  const inventory = entity.getComponent("inventory") as EntityInventoryComponent;
  let container = inventory.container;
  if (!container) return;
  let inventorySize = container.size;

  const items = JSON.parse((world.getDynamicProperty(`inventory:${invName}`) as string) ?? "[]");
  const wornArmor = JSON.parse((world.getDynamicProperty(`armor:${invName}`) as string) ?? "[]");

  const listOfEquipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];
  for (let i = 0; i < listOfEquipmentSlots.length; i++) {
    const equipment = entity.getComponent("equippable") as EntityEquippableComponent;
    if (!equipment) continue;
    const data = wornArmor[i];
    if (!data) {
      container.setItem(i, undefined);
    } else {
      const item = new ItemStack(data.typeId, data.props.amount);

      // Set properties explicitly instead of using dynamic indexing
      if (data.props.keepOnDeath !== undefined) item.keepOnDeath = data.props.keepOnDeath;
      if (data.props.lockMode !== undefined) item.lockMode = data.props.lockMode;
      if (data.props.nameTag !== undefined) item.nameTag = data.props.nameTag;

      item.setLore(data.lore);

      if (data.components.enchantable) {
        const enchantableComponent = item.getComponent("enchantable") as ItemEnchantableComponent;
        if (enchantableComponent) {
          data.components.enchantable = enchantableComponent.addEnchantments(
            data.components.enchantable.map((e: Enchantment) => ({
              ...e,
              type: e.type.id,
            }))
          );
        }
      }

      if (data.components.durability) {
        const durabilityComponent = item.getComponent("durability") as ItemDurabilityComponent;
        durabilityComponent.damage = data.components.durability;
      }

      equipment.setEquipment(listOfEquipmentSlots[i] as EquipmentSlot, item);
    }
  }
  for (let i = 0; i < inventorySize; i++) {
    const data = items[i];
    if (!data) {
      container.setItem(i, undefined);
    } else {
      const item = new ItemStack(data.typeId, data.props.amount);

      // Set properties explicitly instead of using dynamic indexing
      if (data.props.keepOnDeath !== undefined) item.keepOnDeath = data.props.keepOnDeath;
      if (data.props.lockMode !== undefined) item.lockMode = data.props.lockMode;
      if (data.props.nameTag !== undefined) item.nameTag = data.props.nameTag;

      item.setLore(data.lore);
      if (data.components.enchantable) {
        const enchantableComponent = item.getComponent("enchantable") as ItemEnchantableComponent;
        if (enchantableComponent) {
          data.components.enchantable = enchantableComponent.addEnchantments(
            data.components.enchantable.map((e: Enchantment) => ({ ...e, type: e.type.id }))
          );
        }
      }
      if (data.components.durability) {
        const durabilityComponent = item.getComponent("durability") as ItemDurabilityComponent;
        durabilityComponent.damage = data.components.durability;
      }
      container.setItem(i, item);
    }
  }
}

export function dropInventory(invName: string, dimension: Dimension, location: Vector3) {
  try {
    const items = JSON.parse((world.getDynamicProperty(`inventory:${invName}`) as string) ?? "[]");
    const wornArmor = JSON.parse((world.getDynamicProperty(`armor:${invName}`) as string) ?? "[]");

    // Process normal inventory items
    for (let i = 0; i < items.length; i++) {
      const data = items[i];
      if (!data) continue;

      try {
        const item = new ItemStack(data.typeId, data.props.amount);

        if (bundleTypes.includes(data.typeId)) continue;
        if (data.props.keepOnDeath !== undefined)
          // Set item properties
          item.keepOnDeath = data.props.keepOnDeath;
        if (data.props.lockMode !== undefined) item.lockMode = data.props.lockMode;
        if (data.props.nameTag !== undefined) item.nameTag = data.props.nameTag;

        if (data.lore) item.setLore(data.lore);

        // Apply enchantments if available
        if (data.components && data.components.enchantable) {
          const enchantableComponent = item.getComponent("enchantable") as ItemEnchantableComponent;
          if (enchantableComponent) {
            enchantableComponent.addEnchantments(
              data.components.enchantable.map((e: any) => ({
                type: EnchantmentTypes.get(e.type),
                level: e.level,
              }))
            );
          }
        }

        // Apply durability if available
        if (data.components && data.components.durability) {
          const durabilityComponent = item.getComponent("durability") as ItemDurabilityComponent;
          if (durabilityComponent) {
            durabilityComponent.damage = data.components.durability;
          }
        }

        // Spawn the item in the specified dimension
        dimension.spawnItem(item, location);
      } catch (itemError) {
        console.warn(`Failed to spawn item: ${data.typeId}`);
      }
    }

    // Process worn armor items
    for (let i = 0; i < wornArmor.length; i++) {
      const data = wornArmor[i];
      if (!data) continue;

      try {
        const item = new ItemStack(data.typeId, data.props.amount);

        // Set item properties
        if (data.props.keepOnDeath !== undefined) item.keepOnDeath = data.props.keepOnDeath;
        if (data.props.lockMode !== undefined) item.lockMode = data.props.lockMode;
        if (data.props.nameTag !== undefined) item.nameTag = data.props.nameTag;

        if (data.lore) item.setLore(data.lore);

        // Apply enchantments if available
        if (data.components && data.components.enchantable) {
          const enchantableComponent = item.getComponent("enchantable") as ItemEnchantableComponent;
          if (enchantableComponent) {
            enchantableComponent.addEnchantments(
              data.components.enchantable.map((e: any) => ({
                type: EnchantmentTypes.get(e.type),
                level: e.level,
              }))
            );
          }
        }

        // Apply durability if available
        if (data.components && data.components.durability) {
          const durabilityComponent = item.getComponent("durability") as ItemDurabilityComponent;
          if (durabilityComponent) {
            durabilityComponent.damage = data.components.durability;
          }
        }

        // Spawn the item in the specified dimension
        dimension.spawnItem(item, location);
      } catch (itemError) {
        console.warn(`Failed to spawn armor item: ${data.typeId}`);
      }
    }

    // Clean up dynamic properties after successful drop
    world.setDynamicProperty(`inventory:${invName}`, undefined);
    world.setDynamicProperty(`armor:${invName}`, undefined);
  } catch (error) {
    console.warn(`Failed to drop inventory ${invName}: ${error}`);
  }
}

export function playSoundInDimension(dimension: Dimension, location: Vector3, sound: SoundOptions) {
  try {
    const players = dimension.getEntities({
      location: location,
      maxDistance: sound.range || 30,
      type: "minecraft:player",
    }) as Player[];

    const range = sound.range || 30;
    players.forEach((player) => {
      const playerLoc = player.location;
      const soundLoc: Vector3 = {
        x: playerLoc.x + (location.x - playerLoc.x) / (range / 20),
        y: playerLoc.y + (location.y - playerLoc.y) / (range / 20),
        z: playerLoc.z + (location.z - playerLoc.z) / (range / 20),
      };
      const volume =
        CustomVector3.distance(playerLoc, location) * (range / (range * (range / 1.3)));
      player.playSound(sound.id, {
        location: soundLoc,
        volume: (sound.volume ? sound.volume : 1) * (1 - volume),
        pitch: sound.pitch ? sound.pitch : 1,
      });
    });
  } catch {}
}

export interface ItemFilter {
  id?: string[] | "all";
  tags?: string[] | "all";
  exclude?:
    | {
        id?: string[] | "all";
        tags?: string[] | "all";
      }
    | string[];
  include?:
    | {
        id?: string[] | "all";
        tags?: string[] | "all";
      }
    | string[];
  enchantments?: EnchantmentTypes[];
  components?: ItemComponentTypes[];
}

export function filterItem(item: ItemStack | undefined, options: ItemFilter) {
  // Handle undefined items
  if (!item) {
    // For undefined items (like hands), they should pass exclude checks
    // but fail include checks

    // If we have include conditions, an undefined item should fail
    if (
      options.id ||
      options.tags ||
      options.include ||
      options.enchantments ||
      options.components
    ) {
      return false;
    }

    // If we only have exclude conditions, an undefined item should pass
    return true;
  }

  // Check ID directly
  if (options.id === "all" || (Array.isArray(options.id) && options.id.includes(item.typeId)))
    return true;

  // Check tags directly
  if (options.tags === "all") return true;
  if (Array.isArray(options.tags)) {
    for (const tag of options.tags) {
      if (item.hasTag(tag)) return true;
    }
  }

  // Check include conditions
  if (options.include) {
    if (Array.isArray(options.include)) {
      // Legacy string array support for include
      if (options.include.includes(item.typeId)) return true;
    } else {
      if (options.include.id === "all") return true;
      if (Array.isArray(options.include.id) && options.include.id.includes(item.typeId))
        return true;

      if (options.include.tags === "all") return true;
      if (Array.isArray(options.include.tags)) {
        for (const tag of options.include.tags) {
          if (item.hasTag(tag)) return true;
        }
      }
    }
  }

  // Check exclude conditions
  if (options.exclude) {
    if (Array.isArray(options.exclude)) {
      // Legacy string array support
      if (options.exclude.includes(item.typeId)) return false;
    } else {
      // New structured exclude
      if (options.exclude.id === "all") return false;
      if (Array.isArray(options.exclude.id) && options.exclude.id.includes(item.typeId))
        return false;

      if (options.exclude.tags === "all") return false;
      if (Array.isArray(options.exclude.tags)) {
        for (const tag of options.exclude.tags) {
          if (item.hasTag(tag)) return false;
        }
      }
    }
  }

  // Check enchantments
  const enchantments = item.getComponent("minecraft:enchantable") as ItemEnchantableComponent;
  if (enchantments && options.enchantments) {
    for (const enchant of options.enchantments) {
      if (enchantments.hasEnchantment(enchant as EnchantmentType)) return true;
    }
  }

  // Check components
  const components = item.getComponents() as unknown as ItemComponentTypes[];
  if (components && options.components) {
    for (const component of options.components) {
      if (options.components.includes(component)) return true;
    }
  }

  // If no conditions matched but we have include conditions, return false
  if (options.include || options.id || options.tags) return false;

  // Default to true if no filtering criteria were specified
  return true;
}

export function isSneaking(player: Player): boolean {
  const isSneaking = player.isSneaking;
  const velocity = player.getVelocity().y;
  const isFlying = player.getGameMode() === GameMode.Creative && player.isFlying;

  if (isFlying && velocity < 0) {
    return true; // In creative mode, flying downwards counts as sneaking
  }
  if (isSneaking) {
    return true;
  } else {
    return false;
  }
}

export function sendNotification(
  player: Player,
  message: (RawText | string)[],
  icon: string,
  playSound?: boolean
) {
  if (playSound === undefined || playSound) player.playSound("random.toast_recipe_unlocking_in");
  const text: (RawText | string)[] = [
    `toast.${icon}${icon.length < 200 ? "$".repeat(200 - icon.length) : ""}`,
  ];
  for (const messages of message) text.push(messages);
  player.sendMessage(text);
  if (playSound === undefined || playSound)
    system.runTimeout(() => {
      if (player && player.isValid) player.playSound("random.toast_recipe_unlocking_out");
    }, 108);
}

export function destroyBlock(dimension: Dimension, location: Vector3) {
  dimension.runCommand(`setblock ${location.x} ${location.y} ${location.z} air destroy`);
}
