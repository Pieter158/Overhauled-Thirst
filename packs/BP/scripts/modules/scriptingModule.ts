export default abstract class ScriptingModule {
  constructor(public readonly name: string) {}

  public readonly initialize = () => {
    console.log(`[${this.name}] Initializing...`);
    if (this.onInitialize) {
      try {
        this.onInitialize();
      } catch (error) {
        console.error(`[${this.name}] Error: ${error}`);
      }
    }
    console.log(`[${this.name}] Initialized!`);
  };

  public onInitialize?(): void;
}
