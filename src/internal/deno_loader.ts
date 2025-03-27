import { toFileUrl } from "jsr:@std/path/to-file-url";

type DenoMediaType =
  | "JavaScript"
  | "Mjs"
  | "Cjs"
  | "JSX"
  | "TypeScript"
  | "Mts"
  | "Cts"
  | "Dts"
  | "Dmts"
  | "Dcts"
  | "TSX"
  | "Json"
  | "Wasm"
  | "TsBuildInfo"
  | "SourceMap"
  | "Unknown";

type ModuleType = "js" | "jsx" | "ts" | "tsx" | "json" | "binary" | "text" | "empty";

type ModuleInfoError = {
  specifier: string;
  error: string;
};

type ModuleInfo = TypedModuleDetails | ModuleInfoError;

type TypedModuleDetailsEsm = {
  specifier: string;
  local?: string;
  mediaType: DenoMediaType;
};

type TypedModuleDetailsNpm = {
  specifier: string;
  npmPackage: string;
};

type TypedModuleDetailsNode = {
  specifier: string;
};

type TypedModuleDetails =
  | TypedModuleDetailsEsm
  | TypedModuleDetailsNpm
  | TypedModuleDetailsNode;

type DenoInfoJsonV1 = {
  redirects: Record<string, string>;
  modules: ModuleInfo[];
};

type DenoResolveResult = {
  localPath?: string;
  redirected: string;
  moduleType?: ModuleType;
};

export class DenoLoaderPlugin {
  #denoInfoCache = new Map<string, DenoResolveResult>();
  #resolveModuleSpecifierCache = new Map<string, string>();
  #resolvePromises = new Map<string, Promise<DenoResolveResult>>();

  async resolveId(specifier: string, importer?: string) {
    if (importer?.includes("node_modules")) return;

    let id = specifier;
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
      if (importer) {
        const base_url = new URL(
          URL.canParse(importer) ? importer : toFileUrl(importer),
        );
        id = new URL(specifier, base_url).toString();
      }
    }

    let maybeResolved = id;
    if (
      !id.startsWith(".") &&
      !id.startsWith("/") &&
      !importer?.includes("node_modules")
    ) {
      maybeResolved = this.#resolveFromImportMap(id, importer);
    }
    if (maybeResolved.startsWith("node:")) {
      return { id: maybeResolved, external: true };
    }
    if (maybeResolved.startsWith("file:")) {
      const final_id = new URL(maybeResolved).pathname;
      return { id: final_id, external: false };
    }
    if (maybeResolved.startsWith("jsr:")) {
      const cached = await this.#denoResolve(maybeResolved);
      return { id: cached.redirected, external: false };
    }

    if (
      maybeResolved.startsWith("http:") ||
      maybeResolved.startsWith("https:")
    ) {
      return { id: maybeResolved, external: false };
    }
  }

  async load(id: string): Promise<string | undefined> {
    if (
      id.startsWith("jsr:") ||
      id.startsWith("http:") ||
      id.startsWith("https:")
    ) {
      const cached = await this.#denoResolve(id);
      const localPath = cached.localPath;
      if (!localPath) throw Error("no local_path");

      const content = await Deno.readTextFile(localPath);
      const code = cached.moduleType === "json" ? `export default ${content}` : content;
      return code;
    }
  }

  #cacheDenoInfo(info: DenoInfoJsonV1) {
    for (const details of info.modules) {
      if (
        "specifier" in details &&
        !("npm_package" in details) &&
        "mediaType" in details
      ) {
        const result: DenoResolveResult = {
          localPath: details.local,
          redirected: details.specifier,
          moduleType: mapMediaType(details.mediaType),
        };
        this.#denoInfoCache.set(
          details.specifier.replace("file://", ""),
          result,
        );
        for (const [key, value] of Object.entries(info.redirects)) {
          if (value === details.specifier) {
            this.#denoInfoCache.set(key.replace("file://", ""), result);
          }
        }
      }
    }
  }

  #denoResolve(specifier: string): Promise<DenoResolveResult> {
    const cachedResult = this.#denoInfoCache.get(specifier);
    if (cachedResult) return Promise.resolve(cachedResult);

    let promise = this.#resolvePromises.get(specifier);
    if (!promise) {
      promise = (async () => {
        try {
          const info = await denoInfo(specifier);
          this.#cacheDenoInfo(info);

          const cached = this.#denoInfoCache.get(specifier);
          if (!cached) {
            throw new Error("Specifier not found in cache after processing");
          }
          return cached;
        } finally {
          this.#resolvePromises.delete(specifier);
        }
      })();
      this.#resolvePromises.set(specifier, promise);
    }
    return promise;
  }

  #resolveFromImportMap(id: string, importer?: string) {
    const key = JSON.stringify({ id, importer });
    const cacheValue = this.#resolveModuleSpecifierCache.get(key);
    if (cacheValue) return cacheValue;

    if (!importer) return id;

    const value = `${new URL(id, URL.canParse(importer) ? importer : toFileUrl(importer))}`;
    this.#resolveModuleSpecifierCache.set(key, value);
    return value;
  }
}

async function denoInfo(specifier: string): Promise<DenoInfoJsonV1> {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["info", "--no-config", "--quiet", "--json", specifier],
    stdout: "piped",
    stderr: "piped",
  });

  const { stdout } = await command.output();

  const output = new TextDecoder().decode(stdout);
  return JSON.parse(output);
}

function mapMediaType(mediaType: DenoMediaType): ModuleType {
  switch (mediaType) {
    case "JavaScript":
    case "Mjs":
    case "Cjs":
      return "js";
    case "JSX":
      return "jsx";
    case "TypeScript":
    case "Mts":
    case "Cts":
    case "Dts":
    case "Dmts":
    case "Dcts":
      return "ts";
    case "TSX":
      return "tsx";
    case "Json":
      return "json";
    case "Wasm":
      return "binary";
    case "TsBuildInfo":
    case "SourceMap":
      return "text";
    default:
      return "empty";
  }
}
