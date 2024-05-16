import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { pluginExposeRenderer } from "./vite.base.config.js";

export default defineConfig((env) => {
  const { root, mode, forgeConfig, forgeConfigSelf } = env;
  const name = forgeConfigSelf.name ?? "";
  console.log(env);

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
