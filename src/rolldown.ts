import { createRolldownPlugin } from "npm:unplugin";
import { unpluginFactory } from "./internal/factory.ts";

export default createRolldownPlugin(unpluginFactory);
