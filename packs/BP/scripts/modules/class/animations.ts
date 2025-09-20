import {
  PlayAnimationOptions,
} from "@minecraft/server";

export interface Animation {
  animation: string;
  options: PlayAnimationOptions;
}

export interface ChargeAnimationOptions {
  onIdle?: (string | Animation)[];
  cancelDefaultIdle?: boolean;
  onCharge?: (string | Animation)[];
  cancelDefaultCharge?: boolean;
  onRelease?: (string | Animation)[];
  cancelDefaultRelease?: boolean;
}

export interface EffectAnimationOptions {
  onStart?: (string | Animation)[];
  cancelDefaultStart?: boolean;
  onIdle?: (string | Animation)[];
  cancelDefaultIdle?: boolean;
  onEnd?: (string | Animation)[];
  cancelDefaultEnd?: boolean;
}

