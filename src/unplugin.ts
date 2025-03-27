import { createUnplugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

/**
 * Creates an unplugin instance for Deno import resolution.
 *
 * ```ts
 * import { defineConfig } from "npm:rolldown";
 * import denoUnplugin from "jsr:@jeiea/unplugin-deno/unplugin";
 *
 * export default defineConfig({
 *   plugins: [denoUnplugin.rolldown()],
 * });
 * ```
 */
const unplugin: UnpluginInstance<Options> = createUnplugin(unpluginFactory);

export default unplugin;
