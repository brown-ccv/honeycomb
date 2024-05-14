import { defineConfig, mergeConfig } from "vite";

import { getBuildConfig, getBuildDefine, external, pluginHotRestart } from "./vite.base.config.js";

export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'build'>} */
  const forgeEnv = env;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  const config = {
    build: {
      lib: {
        entry: forgeConfigSelf.entry,
        // fileName: () => "[name].js",
        fileName: () => "[name].cjs",
        formats: ["cjs"],
        // formats: ["mjs"],
      },
      rollupOptions: { external },
    },
    plugins: [pluginHotRestart("restart")],
    define,
    resolve: {
      // Load the Node.js entry.
      mainFields: ["module", "jsnext:main", "jsnext"],
    },
  };
  return mergeConfig(getBuildConfig(forgeEnv), config);
});
