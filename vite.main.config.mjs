import { defineConfig, mergeConfig } from "vite";
import { external, getBuildConfig, getDefineKeys, pluginHotRestart } from "./vite.base.config.mjs";

/** Vite configuration for the main process */
export default defineConfig((env) =>
  mergeConfig(getBuildConfig(env), {
    build: {
      lib: {
        entry: env.forgeConfigSelf.entry,
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
  })
);

/** @type {(env: import('vite').ConfigEnv<'build'>) => Record<string, any>} */
export const getBuildDefine = ({ command, forgeConfig }) => {
  const names = forgeConfig.renderer.filter(({ name }) => name != null).map(({ name }) => name);
  const defineKeys = getDefineKeys(names);

  return Object.entries(defineKeys).reduce((acc, [name, keys]) => {
    const { VITE_DEV_SERVER_URL, VITE_NAME } = keys;
    const def = {
      [VITE_DEV_SERVER_URL]:
        command === "serve" ? JSON.stringify(process.env[VITE_DEV_SERVER_URL]) : undefined,
      [VITE_NAME]: JSON.stringify(name),
    };
    return { ...acc, ...def };
  }, {});
};
