import { defineConfig, mergeConfig } from "vite";
import { external, getBuildConfig, pluginHotRestart } from "./vite.base.config.mjs";

/** Vite configuration for the preload process */
// TODO: Can we clean this up at all?
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'build'>} */
  const forgeEnv = env;
  const { forgeConfigSelf } = forgeEnv;
  return mergeConfig(getBuildConfig(forgeEnv), {
    build: {
      rollupOptions: {
        external,
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: forgeConfigSelf.entry,
        output: {
          // TODO: Switch to ESM modules
          format: "cjs",
          // It should not be split chunks.
          inlineDynamicImports: true,
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [pluginHotRestart("reload")],
  });
});
