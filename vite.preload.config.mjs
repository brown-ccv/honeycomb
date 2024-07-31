import { defineConfig, mergeConfig } from "vite";

import { getBuildConfig, external, pluginHotRestart } from "./vite.base.config.mjs";

export default defineConfig((env) => {
  return mergeConfig(getBuildConfig(env), {
    build: {
      rollupOptions: {
        external,
        // Pulls the entries from forge.config.js (may contain Web assets, use the `build.rollupOptions.input` instead `build.lib.entry`)
        input: env.forgeConfigSelf.entry,
        output: {
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
