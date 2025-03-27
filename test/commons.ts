import { fromFileUrl, join, resolve } from "jsr:@std/path";

const assetsDirectory = resolve(fromFileUrl(import.meta.url), "../assets");

export function setup(projectName: string) {
  const project = resolve(assetsDirectory, projectName);
  const paths = {
    input: join(project, "input"),
    expect: join(project, "expect"),
  };

  const cwd = Deno.cwd();
  Deno.chdir(paths.input);

  return Promise.resolve({
    paths,
    cleanup: () => {
      Deno.chdir(cwd);
    },
  });
}
