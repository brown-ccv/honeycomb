import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { pluginExposeRenderer } from "./vite.base.config.js";

export default defineConfig((env) => {
  const { root, mode, forgeConfigSelf } = env;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    base: "./",
    build: { outDir: `.vite/renderer/${name}` },
    plugins: [react(), pluginExposeRenderer(name)],
    resolve: { preserveSymlinks: true },
    clearScreen: false,
  };
});
