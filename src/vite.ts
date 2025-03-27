import { createVitePlugin } from "npm:unplugin";
import { unpluginFactory } from "./internal/factory.ts";

export default createVitePlugin(unpluginFactory);
