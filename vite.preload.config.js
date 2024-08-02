import { defineConfig, mergeConfig } from "vite";
import { external, getBuildConfig, pluginHotRestart } from "./vite.base.config.js";

/** Vite configuration for the preload process */
export default defineConfig((env) =>
  mergeConfig(getBuildConfig(env), {
    build: {
      rollupOptions: {
        external,
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: env.forgeConfigSelf.entry,
        output: {
          format: "cjs", // TODO: Switch to ESM modules
          // It should not be split chunks.
          inlineDynamicImports: true,
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [pluginHotRestart("reload")],
  })
);
