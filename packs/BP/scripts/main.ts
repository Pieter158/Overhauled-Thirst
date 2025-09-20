import DebugModule from "./modules/debugModule";
import FormModule from "./modules/formModule";
import { GlobalIntervals } from "./modules/helper/globalIntervals";
import ItemModule from "./modules/itemModule";
import ScriptingModule from "./modules/scriptingModule";
import PlayerJoinModule from "./modules/playerJoinModule";
import ThirstModule from "./modules/thirstModule";

const modules: ScriptingModule[] = [
  new PlayerJoinModule(),
  new DebugModule(),
  new ItemModule(),
  new FormModule(),
  GlobalIntervals,
  new ThirstModule(),
];

modules.forEach((module) => {
  module.initialize();
});
