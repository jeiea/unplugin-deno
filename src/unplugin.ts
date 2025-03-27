import { createUnplugin, type UnpluginInstance } from "npm:unplugin@^2";
import { type Options, unpluginFactory } from "./internal/factory.ts";

const unplugin: UnpluginInstance<Options> = createUnplugin(unpluginFactory);

export default unplugin;
