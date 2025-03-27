import { createRolldownPlugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

const rolldownPlugin: UnpluginInstance<Options>["rolldown"] = createRolldownPlugin(unpluginFactory);

export default rolldownPlugin;
