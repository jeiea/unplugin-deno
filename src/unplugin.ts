import { createUnplugin } from "npm:unplugin";
import { unpluginFactory } from "./internal/factory.ts";

export default createUnplugin(unpluginFactory);
