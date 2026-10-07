import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintReact from "@eslint-react/eslint-plugin";
import { importX } from "eslint-plugin-import-x";
import globals from "globals";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import path from "node:path";

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

  // Custom configuration
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
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

  // Prettier config
  // NOTE @RobertGemmaJr: Must be last, prettier should override other configs
  eslintConfigPrettier
);
