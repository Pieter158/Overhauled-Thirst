import {
  BlockPermutation,
  CommandPermissionLevel,
  CustomCommand,
  CustomCommandOrigin,
  CustomCommandParamType,
  CustomCommandResult,
  CustomCommandStatus,
  Enchantment,
  EnchantmentType,
  Entity,
  EntityEquippableComponent,
  EntityInventoryComponent,
  EquipmentSlot,
  ItemDurabilityComponent,
  ItemEnchantableComponent,
  ItemStack,
  Player,
  StartupEvent,
  system,
  Vector3,
  World,
  world,
} from "@minecraft/server";
import ScriptingModule from "./scriptingModule";
import { namespace } from "../config/_config";
import { getCardinalDirection, getItemInSlot, loadInventory, saveInventory } from "./helper/utils";

// Base class for command handlers
abstract class CommandHandler {
  abstract registerCommands(registry: any): void;

  protected createSuccessResult(message: string): CustomCommandResult {
    return { status: CustomCommandStatus.Success, message: `§g${message}` };
  }

  protected createFailureResult(message: string): CustomCommandResult {
    return { status: CustomCommandStatus.Failure, message: `§c${message}` };
  }

  protected getPlayerFromOrigin(origin: CustomCommandOrigin): Player | null {
    return (origin.sourceEntity as Player) || null;
  }
}

// Speed command handler
class SpeedCommandHandler extends CommandHandler {
  registerCommands(registry: any): void {
    const speedCommand: CustomCommand = {
      name: `${namespace}:speed`,
      description: "Control player movement speed (1=normal, 10=fastest)",
      permissionLevel: CommandPermissionLevel.Admin,
      optionalParameters: [{ type: CustomCommandParamType.Integer, name: "speedLevel" }],
    };
    registry.registerCommand(speedCommand, this.handleSpeedCommand);
  }

  private handleSpeedCommand = (
    origin: CustomCommandOrigin,
    speedLevel?: number
  ): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    if (speedLevel === undefined) {
      const currentLevel = this.getPlayerSpeedLevel(player);
      player.sendMessage(`§gCurrent speed level: §f${currentLevel}`);
      return this.createSuccessResult("");
    }

    if (speedLevel < 1 || speedLevel > 10) {
      return this.createFailureResult("Speed level must be between 1 and 10!");
    }

    this.setPlayerSpeed(player, speedLevel);
    const message =
      speedLevel === 1 ? "Speed set to normal (1)" : `Speed set to level ${speedLevel}`;
    return this.createSuccessResult(message);
  };

  setPlayerSpeed(player: Player, speedLevel: number): void {
    // Remove all existing speed tags
    system.run(() => {
      for (let i = 2; i <= 10; i++) {
        // Start from 2, since 1 is normal speed
        player.removeTag(`${namespace}:speed_${i}`);
      }
      player.removeTag(`${namespace}:speed`); // Remove legacy tag

      // Only add tag if speed level > 1 (level 1 is normal speed, no tag needed)
      if (speedLevel > 1) {
        player.addTag(`${namespace}:speed_${speedLevel}`);
      }
    });
  }

  getPlayerSpeedLevel(player: Player): number {
    for (let i = 10; i >= 2; i--) {
      // Start checking from 2, since 1 doesn't use a tag
      if (player.hasTag(`${namespace}:speed_${i}`)) {
        return i;
      }
    }
    if (player.hasTag(`${namespace}:speed`)) {
      return 1; // Legacy tag support
    }
    return 1; // Default to normal speed (level 1) when no tags are present
  }

  handleSpeedMovement(player: Player): void {
    const speedLevel = this.getPlayerSpeedLevel(player);
    if (speedLevel === 1) return; // Level 1 is normal speed, no enhancement needed
    if (player.getGameMode() === "Survival") return;

    if (player.isSprinting && !player.isOnGround) {
      const direction = player.getViewDirection();
      const speedMultiplier = 0.7 + speedLevel * 0.23;
      player.applyKnockback(
        { x: direction.x * speedMultiplier, z: direction.z * speedMultiplier },
        direction.y * speedMultiplier
      );
    }
  }
}

// Debug command handler
class DebugCommandHandler extends CommandHandler {
  registerCommands(registry: any): void {
    const debugCommand: CustomCommand = {
      name: `${namespace}:debug`,
      description: "Toggle debug modes (block, boss, etc.)",
      permissionLevel: CommandPermissionLevel.Admin,
      optionalParameters: [{ type: CustomCommandParamType.String, name: "category" }],
    };
    registry.registerCommand(debugCommand, this.handleDebugCommand);

    const entitiesCommand: CustomCommand = {
      name: `${namespace}:entities`,
      description: "List all entities and their counts within a radius (default: 100)",
      permissionLevel: CommandPermissionLevel.Admin,
      optionalParameters: [{ type: CustomCommandParamType.Integer, name: "radius" }],
    };
    registry.registerCommand(entitiesCommand, this.handleEntitiesCommand);
  }

  private handleDebugCommand = (
    origin: CustomCommandOrigin,
    category?: string
  ): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    const debugCategory = category || "block";
    switch (debugCategory.toLowerCase()) {
      case "block":
        return this.toggleDebugCategory(player, "debug", "Block debug");
      case "boss":
        return this.toggleDebugCategory(player, "debug_boss", "Boss debug");
      default:
        return this.createFailureResult("Invalid debug category. Available: block, boss");
    }
  };

  private handleEntitiesCommand = (
    origin: CustomCommandOrigin,
    radius?: number
  ): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    const searchRadius = radius ?? 100; // Default to 100 if no radius specified
    if (searchRadius <= 0) {
      return this.createFailureResult("Radius must be greater than 0");
    }

    try {
      const entities = player.dimension.getEntities({
        location: player.location,
        maxDistance: searchRadius
      });

      // Count entities by type
      const counts = new Map<string, number>();
      let totalCount = 0;

      entities.forEach(entity => {
        // Skip the command executor from the count
        if (entity.id === player.id) return;

        const type = entity.typeId;
        counts.set(type, (counts.get(type) || 0) + 1);
        totalCount++;
      });

      // Sort entities by count (highest to lowest)
      const sortedCounts = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => `§7[${count}] §f${type}`)
        .join('§8, ');

      return this.createSuccessResult(
        `§2[${totalCount}] §fEntities within ${searchRadius} blocks:\n${sortedCounts}`
      );
    } catch (error) {
      return this.createFailureResult(`Failed to list entities: ${error}`);
    }
  };

  private toggleDebugCategory(
    player: Player,
    tagSuffix: string,
    displayName: string
  ): CustomCommandResult {
    const tagName = `${namespace}:${tagSuffix}`;
    const hasTag = player.hasTag(tagName);

    if (hasTag) {
      system.run(() => {
        player.removeTag(tagName);
      });
      return this.createSuccessResult(`${displayName} disabled`);
    } else {
      system.run(() => {
        player.addTag(tagName);
      });
      return this.createSuccessResult(`${displayName} enabled`);
    }
  }

  handleDebugDisplay(player: Player): void {
    if (player.hasTag(`${namespace}:debug`)) {
      const block = player.getBlockFromViewDirection({ maxDistance: 10 })?.block;
      if (block) {
        const states = block.permutation.getAllStates();
        const formattedStates = Object.entries(states)
          .map(([key, value]) => `§8${key}: §7${value}§8`)
          .join(", \n");
        player.runCommand(`title @s actionbar ${formattedStates}`);
      }
    }

    if (player.hasTag(`${namespace}:debug_boss`)) {
      const entity = player.getEntitiesFromViewDirection({ maxDistance: 10 })[0];
      if (entity) {
        const attackMode = entity.entity.getProperty("sb_ob:attack_mode");
        const attackRange = entity.entity.getProperty("sb_ob:attack_range");
        const cooldown = entity.entity.getProperty("sb_ob:has_cooldown");
        player.runCommand(
          `title @s actionbar ${entity.entity.typeId}, ${attackMode}, ${attackRange}, ${cooldown}`
        );
      }
    }
  }
}

// Gamemode utility commands
class GamemodeCommandHandler extends CommandHandler {
  registerCommands(registry: any): void {
    const gamemodes = [
      { short: "gms", mode: "survival", description: "Set gamemode to Survival" },
      { short: "gmc", mode: "creative", description: "Set gamemode to Creative" },
      { short: "gma", mode: "adventure", description: "Set gamemode to Adventure" },
      { short: "gmsp", mode: "spectator", description: "Set gamemode to Spectator" },
      { short: "gm0", mode: "survival", description: "Set gamemode to Survival" },
      { short: "gm1", mode: "creative", description: "Set gamemode to Creative" },
      { short: "gm2", mode: "adventure", description: "Set gamemode to Adventure" },
      { short: "gm3", mode: "spectator", description: "Set gamemode to Spectator" }
    ];

    gamemodes.forEach(({ short, mode, description }) => {
      const command: CustomCommand = {
        name: `${namespace}:${short}`,
        description,
        permissionLevel: CommandPermissionLevel.Admin,
      };
      registry.registerCommand(command, (origin: CustomCommandOrigin) =>
        this.handleGamemodeCommand(origin, mode)
      );
    });
  }

  private handleGamemodeCommand = (
    origin: CustomCommandOrigin,
    gamemode: string
  ): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    try {
      system.run(() => {
        player.runCommand(`gamemode ${gamemode}`);
      });
    } catch (error) {
      return this.createFailureResult(`Failed to set gamemode: ${error}`);
    }
  };
}

// Weather and time utility commands
class UtilityCommandHandler extends CommandHandler {
  private weatherCycleEnabled: boolean = true;
  private daylightCycleEnabled: boolean = true;

  registerCommands(registry: any): void {
    const clearCommand: CustomCommand = {
      name: `${namespace}:c`,
      description: "Clear player inventory",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(clearCommand, this.handleClearCommand);

    const toggleWeatherCommand: CustomCommand = {
      name: `${namespace}:toggleweather`,
      description: "Toggle weather cycle on/off",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(toggleWeatherCommand, this.handleToggleWeather);

    const toggleDayNightCommand: CustomCommand = {
      name: `${namespace}:toggledaynight`,
      description: "Toggle day/night cycle on/off",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(toggleDayNightCommand, this.handleToggleDayNight);

  // Set time commands
    const dayCommand: CustomCommand = {
      name: `${namespace}:day`,
      description: "Set time to day",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(dayCommand, this.handleDayCommand);

    const nightCommand: CustomCommand = {
      name: `${namespace}:night`,
      description: "Set time to night",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(nightCommand, this.handleNightCommand);

    const noonCommand: CustomCommand = {
      name: `${namespace}:noon`,
      description: "Set time to noon",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(noonCommand, this.handleNoonCommand);

    const midnightCommand: CustomCommand = {
      name: `${namespace}:midnight`,
      description: "Set time to midnight",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(midnightCommand, this.handleMidnightCommand);

    const sunriseCommand: CustomCommand = {
      name: `${namespace}:sunrise`,
      description: "Set time to sunrise",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(sunriseCommand, this.handleSunriseCommand);

    const sunsetCommand: CustomCommand = {
      name: `${namespace}:sunset`,
      description: "Set time to sunset",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(sunsetCommand, this.handleSunsetCommand);

    const healCommand: CustomCommand = {
      name: `${namespace}:heal`,
      description: "Apply instant_health and saturation to heal a player",
      permissionLevel: CommandPermissionLevel.Admin,
      optionalParameters: [{ type: CustomCommandParamType.String, name: "playerName" }],
    };
    registry.registerCommand(healCommand, this.handleHealCommand);

    const upCommand: CustomCommand = {
      name: `${namespace}:up`,
      description: "Teleport up by specified number of blocks (default: 100)",
      permissionLevel: CommandPermissionLevel.Admin,
      optionalParameters: [{ type: CustomCommandParamType.Integer, name: "blocks" }],
    };
    registry.registerCommand(upCommand, this.handleUpCommand);

    const killAllCommand: CustomCommand = {
      name: `${namespace}:killall`,
      description: "Kill all entities except players and protected entities",
      permissionLevel: CommandPermissionLevel.Admin,
    };
    registry.registerCommand(killAllCommand, this.handleKillAllCommand);
  }

  private handleUpCommand = (
    origin: CustomCommandOrigin,
    blocks?: number
  ): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    const height = blocks ?? 100; // Default to 100 if no value provided
    if (height <= 0) {
      return this.createFailureResult("Height must be greater than 0");
    }

    try {
      const pos = player.location;
      const newY = pos.y + height;
      system.run(() => {
        // First teleport the player
        player.teleport(
          { x: pos.x, y: newY, z: pos.z },
          { dimension: player.dimension }
        );
        // Then place a glass block one block below them
        player.dimension.runCommand(`setblock ${Math.floor(pos.x)} ${Math.floor(newY - 1)} ${Math.floor(pos.z)} minecraft:glass`);
      });
      return this.createSuccessResult(`§dWoosh!`);
    } catch (error) {
      return this.createFailureResult(`Failed to teleport: ${error}`);
    }
  };

  private handleHealCommand = (
    origin: CustomCommandOrigin,
    playerName?: string
  ): CustomCommandResult | undefined => {
    const executor = this.getPlayerFromOrigin(origin);
    if (!executor) {
      return this.createFailureResult("Command must be run by a player");
    }

    try {
      // If no player name is specified, heal the executor
      if (!playerName) {
        system.run(() => {
          executor.runCommand("effect @s instant_health 1 255 true");
          executor.runCommand("effect @s saturation 1 255 true");
        });
        return this.createSuccessResult(`Healed ${executor.name}`);
      }

      // If a player name is specified, check if they exist first
      const targetPlayer = [...world.getPlayers()].find(p => p.name.toLowerCase() === playerName.toLowerCase());
      if (!targetPlayer) {
        return this.createFailureResult(`Player "${playerName}" not found`);
      }

      // If player exists, heal them
      system.run(() => {
        executor.runCommand(`effect @p[name="${targetPlayer.name}"] instant_health 1 255 true`);
        executor.runCommand(`effect @p[name="${targetPlayer.name}"] saturation 1 255 true`);
      });
      return this.createSuccessResult(`Healed ${targetPlayer.name}`);
    } catch (error) {
      return this.createFailureResult(`Failed to apply healing effects: ${error}`);
    }
  };

  private handleToggleWeather = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    this.weatherCycleEnabled = !this.weatherCycleEnabled;
    try {
      system.run(() => {
        player.runCommand(`gamerule doweathercycle ${this.weatherCycleEnabled}`);
      });
      const status = this.weatherCycleEnabled ? "enabled" : "disabled";
      return this.createSuccessResult(`Weather cycle ${status}`);
    } catch (error) {
      return this.createFailureResult(`Failed to toggle weather cycle: ${error}`);
    }
  };

  private handleToggleDayNight = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    this.daylightCycleEnabled = !this.daylightCycleEnabled;
    try {
      system.run(() => {
        player.runCommand(`gamerule dodaylightcycle ${this.daylightCycleEnabled}`);
      });
      const status = this.daylightCycleEnabled ? "enabled" : "disabled";
      return this.createSuccessResult(`Day/night cycle ${status}`);
    } catch (error) {
      return this.createFailureResult(`Failed to toggle day/night cycle: ${error}`);
    }
  };

  private handleDayCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("time set day");
      });
      return this.createSuccessResult("Time set to day");
    } catch (error) {
      return this.createFailureResult(`Failed to set time: ${error}`);
    }
  };

  private handleNightCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("time set night");
      });
      return this.createSuccessResult("Time set to night");
    } catch (error) {
      return this.createFailureResult(`Failed to set time: ${error}`);
    }
  };

  private handleNoonCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("time set noon");
      });
      return this.createSuccessResult("Time set to noon");
    } catch (error) {
      return this.createFailureResult(`Failed to set time: ${error}`);
    }
  };

  private handleMidnightCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("time set midnight");
      });
      return this.createSuccessResult("Time set to midnight");
    } catch (error) {
      return this.createFailureResult(`Failed to set time: ${error}`);
    }
  };

  private handleSunriseCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("time set sunrise");
      });
      return this.createSuccessResult("Time set to sunrise");
    } catch (error) {
      return this.createFailureResult(`Failed to set time: ${error}`);
    }
  };

  private handleSunsetCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("time set sunset");
      });
      return this.createSuccessResult("Time set to sunset");
    } catch (error) {
      return this.createFailureResult(`Failed to set time: ${error}`);
    }
  };

  private handleClearCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }
    try {
      system.run(() => {
        player.runCommand("clear @s");
      });
      return this.createSuccessResult("Inventory cleared");
    } catch (error) {
      return this.createFailureResult(`Failed to clear inventory: ${error}`);
    }
  };

  private handleKillAllCommand = (origin: CustomCommandOrigin): CustomCommandResult | undefined => {
    const player = this.getPlayerFromOrigin(origin);
    if (!player) {
      return this.createFailureResult("Command must be run by a player");
    }

    try {
      const protectedEntities = [
        "minecraft:player",
        "minecraft:armor_stand",
        "minecraft:painting"
      ];

      const entities = player.dimension.getEntities();
      const counts = new Map<string, number>();
      let killCount = 0;

      entities.forEach(entity => {
        // Skip if it's a protected entity type
        if (protectedEntities.includes(entity.typeId)) {
          return;
        }

        // Track entity count by type
        counts.set(entity.typeId, (counts.get(entity.typeId) || 0) + 1);
        killCount++;

        // Kill the entity
        system.run(() => {
          entity.kill();
        });
      });

      // Sort entities by count (highest to lowest)
      const sortedCounts = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => `§7[${count}] §f${type}`)
        .join('§8, ');

      return this.createSuccessResult(
        `§2[${killCount}] §fEntities killed:\n${sortedCounts}`
      );
    } catch (error) {
      return this.createFailureResult(`Failed to kill entities: ${error}`);
    }
  };
}

export default class DebugModule extends ScriptingModule {
  private speedHandler = new SpeedCommandHandler();
  private debugHandler = new DebugCommandHandler();
  private gamemodeHandler = new GamemodeCommandHandler();
  private utilityHandler = new UtilityCommandHandler();

  constructor() {
    super("DebugModule");
  }

  public onInitialize(): void {
    // Register all command handlers
    system.beforeEvents.startup.subscribe((init: StartupEvent) => {
      const registry = init.customCommandRegistry;

      // Register all command categories
      this.speedHandler.registerCommands(registry);
      this.debugHandler.registerCommands(registry);
      this.gamemodeHandler.registerCommands(registry);
      this.utilityHandler.registerCommands(registry);
    });

    // Main game loop for debug displays and speed handling
    system.runInterval(() => {
      world.getPlayers().forEach((player) => {
        // Handle debug displays
        this.debugHandler.handleDebugDisplay(player);

        // Handle speed movement
        this.speedHandler.handleSpeedMovement(player);
      });
    });
  }
}
