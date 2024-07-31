import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { pluginExposeRenderer } from "./vite.base.config.mjs";

/** Vite configuration for the render process */
export default defineConfig(({ root, mode, forgeConfig, forgeConfigSelf }) => {
  const name = forgeConfigSelf.name ?? "";
  return {
    root,
    mode,
    define: forgeConfig.define,
    base: "./",
    build: { outDir: `.vite/renderer/${name}` },
    plugins: [react(), pluginExposeRenderer(name)],
    resolve: { preserveSymlinks: true },
    clearScreen: false,
  };
});
