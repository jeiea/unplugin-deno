import { expect } from "jsr:@std/expect";
import { join } from "jsr:@std/path";
import { rolldown } from "npm:rolldown";
import createDenoLoaderPlugin from "../src/rolldown.ts";
import { setup } from "./commons.ts";

Deno.test("Given assets/input/main.ts", async (test) => {
  const { paths, cleanup } = await setup("basic");
  const input = join(paths.input, "main.ts");

  await test.step("when run rolldown with deno-loader", async (test) => {
    const bundle = await rolldown({ input, plugins: [createDenoLoaderPlugin({})] });
    const { output } = await bundle.generate();

    await test.step("it should inline https dependency", async () => {
      const expected = await Deno.readTextFile(join(paths.expect, "main.js"));
      expect(output[0].code).toEqual(expected);
    });
  });

  cleanup();
});
