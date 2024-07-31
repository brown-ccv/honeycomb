import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";
import { baseConfig } from "./forge.config";

/** Vite configuration used when running in the browser */
export default defineConfig(({ root, mode }) =>
  mergeConfig(
    baseConfig,
    // TODO @RobertGemmaJr: A bunch of this stuff could be included in the default config
    // TODO @RobertGemmaJr: Would help cleanup some of the vite stuff?
    defineConfig({
      root,
      mode,
      base: "./",
      plugins: [react()],
      resolve: { preserveSymlinks: true },
      clearScreen: false,
    })
  )
);
