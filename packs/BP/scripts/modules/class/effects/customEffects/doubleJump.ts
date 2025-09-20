import { Player, Entity, system, world } from "@minecraft/server";

// Track jump state for each player
const playerJumpState = new Map<
  string,
  { hasDoubleJumped: boolean; jumpedOnce: boolean; lastJumpTick: number }
>();

/**
 * Double jump effect that allows players to jump again while in the air.
 * Uses `player.isJumping` to detect jumps and applies vertical knockback.
 *
 * @param target - The player with the effect
 */
export function doubleJump(target: Player | Entity) {
  if (!(target instanceof Player)) {
    return;
  }

  const player = target;
  const isJumping = player.isJumping;
  const isOnGround = player.isOnGround;
  const currentTick = system.currentTick;

  // Initialize player state if not exists
  if (!playerJumpState.has(player.id)) {
    playerJumpState.set(player.id, {
      hasDoubleJumped: false,
      jumpedOnce: false,
      lastJumpTick: 0,
    });
  }

  const jumpState = playerJumpState.get(player.id)!;

  // Reset state when the player touches the ground
  if (isOnGround) {
    jumpState.hasDoubleJumped = false;
    jumpState.jumpedOnce = false;
    jumpState.lastJumpTick = 0;
    return;
  }

  // Detect the first jump (player must be in the air)
  if (
    isJumping &&
    !jumpState.jumpedOnce &&
    !jumpState.hasDoubleJumped &&
    currentTick - jumpState.lastJumpTick > 2 // Ensure a cooldown of 5 ticks
  ) {
    jumpState.jumpedOnce = true;
    jumpState.lastJumpTick = currentTick;
    return; // Do nothing on the first jump
  }

  // Detect the second jump (double jump, only if the player is in the air)
  if (
    isJumping &&
    jumpState.jumpedOnce &&
    !jumpState.hasDoubleJumped &&
    !isOnGround && // Ensure the player is in the air
    currentTick - jumpState.lastJumpTick > 2 // Ensure a cooldown of 5 ticks
  ) {
    jumpState.hasDoubleJumped = true;
    executeDoubleJump(player);
  }
}

/**
 * Execute the double jump with vertical knockback and prevent fall damage
 */
function executeDoubleJump(player: Player) {
  world.sendMessage(`§b[DoubleJump] ${player.name} executed double jump!`);

  // Apply upward knockback for double jump
  const upwardForce = 1.0; // Adjust this value for desired jump height
  player.applyKnockback({ x: 0, z: 0 }, upwardForce);

  // Temporarily prevent fall damage

  // Play sound effect
  player.dimension.playSound("mob.enderdragon.flap", player.location, {
    pitch: 1.5,
    volume: 0.5,
  });

  // Spawn particles for visual feedback
  const particleLocation = {
    x: player.location.x,
    y: player.location.y + 1,
    z: player.location.z,
  };

  player.dimension.spawnParticle(
    "minecraft:knockback_roar_particle",
    particleLocation
  );
}
