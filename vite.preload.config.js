import { defineConfig, mergeConfig } from "vite";

import { getBuildConfig, external, pluginHotRestart } from "./vite.base.config.js";

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
          format: "cjs",
          // It should not be split chunks.
          // TODO: We probably want some basic chunking? Getting a warning
          inlineDynamicImports: true,
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name].cjs",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [pluginHotRestart("reload")],
  });
});
