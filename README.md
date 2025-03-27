# unplugin-deno

deno unplugin. Simplified version of
[@bureaudouble/rolldown-deno-loader-plugin](https://jsr.io/@bureaudouble/rolldown-deno-loader-plugin).

## Usage

```ts
// rolldown.config.mts
import { defineConfig } from "npm:rolldown";
import denoPlugin from "jsr:@jeiea/unplugin-deno/rolldown";

export default defineConfig({
  plugins: [denoPlugin()],
});
```

## Comments

Not extensively tested.
