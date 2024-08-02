import { defineConfig, mergeConfig } from "vite";
import { external, getBuildConfig, getDefineKeys, pluginHotRestart } from "./vite.base.config.mjs";

/** Vite configuration for the main process */
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'build'>} */
  const forgeEnv = env;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  return mergeConfig(getBuildConfig(forgeEnv), {
    build: {
      lib: {
        entry: forgeConfigSelf.entry,
        fileName: () => "[name].js",
        formats: ["cjs"],
      },
      rollupOptions: {
        external,
      },
    },
    plugins: [pluginHotRestart("restart")],
    define,
    resolve: {
      // Load the Node.js entry.
      mainFields: ["module", "jsnext:main", "jsnext"],
    },
  });
});

/** @type {(env: import('vite').ConfigEnv<'build'>) => Record<string, any>} */
export const getBuildDefine = (env) => {
  const { command, forgeConfig } = env;
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
