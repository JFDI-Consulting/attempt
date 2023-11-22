/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// import { viteStaticCopy } from "vite-plugin-static-copy";

module.exports = defineConfig({
    base: "./",
    plugins: [
        dts({
            rollupTypes: true
        })
        // viteStaticCopy({
        //     targets: [
        //         {
        //             src: ["*.md", "package.json"],
        //             dest: "./"
        //         }
        //     ]
        // })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "attempt",
            fileName: "index",
            formats: ["es", "cjs"]
        }
    },
    test: {}
});
