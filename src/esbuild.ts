import { createEsbuildPlugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

const esbuildPlugin: UnpluginInstance<Options>["esbuild"] = createEsbuildPlugin(unpluginFactory);

export default esbuildPlugin;
