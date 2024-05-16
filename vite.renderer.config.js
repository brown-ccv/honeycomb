import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { pluginExposeRenderer } from "./vite.base.config.js";

export default defineConfig((env) => {
  const { root, mode, forgeConfigSelf } = env;
  const name = forgeConfigSelf.name ?? "";

  return {
    root,
    mode,
    // TODO: These should really be in the base config? Make them available everywhere?
    // TODO: Can we include them in import.meta.env instead
    define: {
      APP_NAME: JSON.stringify(process.env.npm_package_name),
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    base: "./",
    build: { outDir: `.vite/renderer/${name}` },
    plugins: [react(), pluginExposeRenderer(name)],
    resolve: { preserveSymlinks: true },
    clearScreen: false,
  };
});
