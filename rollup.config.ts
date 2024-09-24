import replace from "@rollup/plugin-replace";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import { readFileSync } from "fs";
import { defineConfig } from "rollup";
import serve from "rollup-plugin-serve";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

const libraryName = "plugin";

export default defineConfig({
  input: `src/${libraryName}.tsx`,
  external: [
    "react",
    "@builder.io/react",
    "@builder.io/app-context",
    "@material-ui/core",
    "@emotion/core",
    "@emotion/styled",
    "mobx",
    "react-dom",
    "mobx-react",
  ],
  output: [{ file: pkg.unpkg, format: "system", sourcemap: true }],
  watch: {
    include: "src/**",
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    json(),
    nodeResolve({
      mainFields: ["module", "browser", "main"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs(),
    esbuild(),
    serve({
      contentBase: "dist",
      port: 1268,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }),
  ],
});
