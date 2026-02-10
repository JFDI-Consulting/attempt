import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es6,
                Atomics: "readonly",
                SharedArrayBuffer: "readonly"
            },
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2020
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: prettierPlugin
        },
        rules: {
            "prettier/prettier": [
                "warn",
                {
                    endOfLine: "auto"
                }
            ],
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "no-console": "off",
            "no-extra-semi": "warn",
            "no-extra-boolean-cast": "warn",
            "no-undef": "off" // TypeScript handles this
        }
    },
    prettierConfig
];
