import { defineConfig, mergeConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { getBuildConfig, getBuildDefine, external, pluginHotRestart } from "./vite.base.config.js";

export default defineConfig((env) => {
  return mergeConfig(getBuildConfig(env), {
    build: {
      lib: {
        // Pulls the entries from forge.config.js
        entry: env.forgeConfigSelf.entry,
        // The files are built in CJS format, update the extensions
        fileName: () => "[name].cjs",
        formats: ["cjs"],
      },
      // TEMP: Test external
      // rollupOptions: { external },
      rollupOptions: { external: ["serialport"] },
    },
    // TEMP: Test if the node polyfills fixes the issue
    plugins: [nodePolyfills(), pluginHotRestart("restart")],
    define: getBuildDefine(env),
    resolve: {
      // Load the Node.js entry.
      mainFields: ["module", "jsnext:main", "jsnext"],
    },
  });
});
