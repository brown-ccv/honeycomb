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
          format: "es",
          // It should not be split chunks.
          inlineDynamicImports: true,
          // NOTE: The preload script must be built with the .mjs extensions: https://www.electronjs.org/docs/latest/tutorial/esm#esm-preload-scripts-must-have-the-mjs-extension
          // entryFileNames: "[name].js",
          // chunkFileNames: "[name].js",
          entryFileNames: "[name].mjs",
          chunkFileNames: "[name].mjs",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [pluginHotRestart("reload")],
  })
);
