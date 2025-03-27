import { createVitePlugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

/**
 * Creates a vite plugin instance for Deno import resolution.
 *
 * ```ts
 * import { defineConfig } from "npm:vite";
 * import denoPlugin from "jsr:@jeiea/unplugin-deno/vite";
 *
 * export default defineConfig({
 *   plugins: [denoPlugin()],
 * });
 * ```
 */
const vitePlugin: UnpluginInstance<Options>["vite"] = createVitePlugin(unpluginFactory);

export default vitePlugin;
