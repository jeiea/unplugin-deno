import { createVitePlugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

const vitePlugin: UnpluginInstance<Options>["vite"] = createVitePlugin(unpluginFactory);

export default vitePlugin;
