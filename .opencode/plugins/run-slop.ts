import { spawn } from "node:child_process";
import { isAbsolute, resolve } from "node:path";
import { Plugin } from "@opencode/plugin";

interface RunSlopResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

function runSlop(file: string, cwd: string): Promise<RunSlopResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn("uv", ["run", "--no-active", "sloperator.py", file], { cwd });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolvePromise({ stdout, stderr, exitCode: code ?? 1 });
    });

    child.stdin.end();
  });
}

export default Plugin.define({
  id: "applymaxxing.run-slop",
  setup: async (ctx) => {
    const root = ctx.location.directory;

    await ctx.tool.transform((tools) => {
      tools.add({
        name: "run_slop",
        description:
          "Run a SlopLang (.slop) file with the sloperator interpreter. Returns stdout, stderr, and exitCode as JSON.",
        input: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Path to the .slop file, absolute or relative to the project root",
            },
          },
          required: ["path"],
          additionalProperties: false,
        },
        options: { codemode: false },
        execute: async (input) => {
          const { path } = input as { path: string };
          const file = isAbsolute(path) ? path : resolve(root, path);

          try {
            const result = await runSlop(file, root);
            return { content: JSON.stringify(result, null, 2) };
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
              content: JSON.stringify({ stdout: "", stderr: message, exitCode: 1 }, null, 2),
            };
          }
        },
      });
    });
  },
});
