import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";

import baseConfig, { pluginExposeRenderer } from "./vite.base.config.mjs";

/** Vite configuration for the render process */
// TODO: Can we clean this up at all?
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";
  return mergeConfig(baseConfig, {
    build: { outDir: `.vite/renderer/${name}` },
    plugins: [react(), pluginExposeRenderer(name)],
  });
});
