import path from "node:path";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintReact from "@eslint-react/eslint-plugin";
import { importX } from "eslint-plugin-import-x";
import globals from "globals";
import { defineConfig, includeIgnoreFile } from "eslint/config";

/**
 * This file defines specific rules for Prettier. It adjusts their default settings.
 * We recommend these settings if your lab does not have specific linting standards.
 *
 * @type {import('eslint').FlatConfig}
 */
export default defineConfig(
  // Global ignores (anything ignored by git or prettier)
  includeIgnoreFile([
    path.resolve(import.meta.dirname, ".gitignore"),
    path.resolve(import.meta.dirname, ".prettierignore"),
  ]),

  // Add the base configurations
  js.configs.recommended,
  eslintReact.configs.recommended,
  importX.flatConfigs.recommended,

  // Custom configuration (shared by every file)
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": "warn",
      "import-x/order": "warn",
    },
    settings: {
      react: { version: "detect" },
      jsdoc: { tagNamePreference: { typedef: { definedInFiles: ["src/lib/typedef.js"] } } },
      "import-x/resolver": { node: { extensions: [".js", ".jsx"] } },
    },
  },

  // The app (Vite bundles this for the browser)
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: { sourceType: "module", globals: globals.browser },
  },

  // Node scripts and configuration written as ES modules
  {
    files: ["vite.config.mjs", "eslint.config.mjs", "version.js", "cli.js"],
    languageOptions: { sourceType: "module", globals: globals.node },
  },

  // Electron's main and preload processes and other configuration written as CommonJS
  {
    files: ["electron/**/*.js", "forge.config.js", ".prettierrc.js"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },

  // Prettier config
  // NOTE @RobertGemmaJr: Must be last, prettier should override other configs
  eslintConfigPrettier
);
