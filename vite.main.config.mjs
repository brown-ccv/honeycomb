import { defineConfig, mergeConfig } from "vite";

import { getBuildConfig, getDefineKeys, external, pluginHotRestart } from "./vite.base.config.mjs";

/** @type {(env: import('vite').ConfigEnv<'build'>) => Record<string, any>} */
const getBuildDefine = ({ command, forgeConfig }) => {
  const names = forgeConfig.renderer.filter(({ name }) => name != null).map(({ name }) => name);
  const defineKeys = getDefineKeys(names);
  const define = Object.entries(defineKeys).reduce((acc, [name, keys]) => {
    const { VITE_DEV_SERVER_URL, VITE_NAME } = keys;
    const def = {
      [VITE_DEV_SERVER_URL]:
        command === "serve" ? JSON.stringify(process.env[VITE_DEV_SERVER_URL]) : undefined,
      [VITE_NAME]: JSON.stringify(name),
    };
    return { ...acc, ...def };
  }, {});

  return define;
};

/** Vite configuration for the main process */
export default defineConfig((env) => {
  return mergeConfig(getBuildConfig(env), {
    build: {
      lib: {
        entry: env.forgeConfigSelf.entry, // Pulls the entries from forge.config.js
        fileName: () => "[name].js",
        formats: ["cjs"],
      },
      rollupOptions: { external },
    },
    plugins: [pluginHotRestart("restart")],
    define: getBuildDefine(env),
    resolve: {
      // Load the Node.js entry.
      mainFields: ["module", "jsnext:main", "jsnext"],
    },
  });
});
