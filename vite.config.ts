/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "attempt",
      formats:["es","cjs"],
    },
  },
  test: {

  }
});
