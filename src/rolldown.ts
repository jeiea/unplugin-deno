import { createRolldownPlugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

/**
 * Creates a rolldown plugin instance for Deno import resolution.
 *
 * ```ts
 * import { defineConfig } from "npm:rolldown";
 * import denoPlugin from "jsr:@jeiea/unplugin-deno/rolldown";
 *
 * export default defineConfig({
 *   plugins: [denoPlugin()],
 * });
 * ```
 */
const rolldownPlugin: UnpluginInstance<Options>["rolldown"] = createRolldownPlugin(unpluginFactory);

export default rolldownPlugin;
