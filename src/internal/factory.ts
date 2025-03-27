import type { UnpluginFactory } from "npm:unplugin";
import { DenoLoaderPlugin } from "./deno_loader.ts";

type Options = object;

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
