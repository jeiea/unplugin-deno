import type { UnpluginFactory } from "npm:unplugin@^2";
import { DenoLoaderPlugin } from "./deno_loader.ts";

export type Options = object | undefined;

export const unpluginFactory: UnpluginFactory<Options> = () => {
  const loader = new DenoLoaderPlugin();

  return {
    name: "unplugin-deno",

    resolveId(id, importer) {
      return loader.resolveId(id, importer);
    },

    load(id) {
      return loader.load(id);
    },
  };
};
