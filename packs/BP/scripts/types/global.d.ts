// Global type declarations for Overhauled-Thirst

declare module "@minecraft/server" {
  interface BlockStateSuperset {
    [key: string]: any;
  }
  interface BlockPermutation {
    withState(state: string, value: any): BlockPermutation;
    getState(state: string): any;
    getAllStates(): Record<string, any>;
  }
}

export {};
