import { createEsbuildPlugin } from "npm:unplugin";
import { unpluginFactory } from "./internal/factory.ts";

export default createEsbuildPlugin(unpluginFactory);
