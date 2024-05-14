import { defineConfig, mergeConfig } from "vite";

import { getBuildConfig, external, pluginHotRestart } from "./vite.base.config.js";

export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'build'>} */
  const forgeEnv = env;
  const { forgeConfigSelf } = forgeEnv;
  /** @type {import('vite').UserConfig} */
  const config = {
    build: {
      rollupOptions: {
        external,
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: forgeConfigSelf.entry,
        output: {
          format: "cjs",
          // format: "mjs",
          // It should not be split chunks.
          inlineDynamicImports: true,
          // entryFileNames: "[name].js",
          // chunkFileNames: "[name].js",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name].cjs",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [pluginHotRestart("reload")],
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
