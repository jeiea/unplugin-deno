import { createEsbuildPlugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

/**
 * Creates an esbuild plugin instance for Deno import resolution.
 *
 * ```ts
 * import { build } from "npm:esbuild@0.24.0";
 * import denoPlugin from "jsr:@jeiea/unplugin-deno/esbuild";
 *
 * await build({
 *   plugins: [denoPlugin()],
 * });
 * ```
 */
const esbuildPlugin: UnpluginInstance<Options>["esbuild"] = createEsbuildPlugin(unpluginFactory);

export default esbuildPlugin;
