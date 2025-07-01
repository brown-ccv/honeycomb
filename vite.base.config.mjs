import { builtinModules } from "node:module";
import { defineConfig } from "vite";
import pkg from "./package.json";

/** Base vite config shared between electron-forge and the browser */
export default defineConfig({
  base: "./",
  define: {
    // TODO: Rename as __APP_NAME__ and __APP_VERSION__
    "import.meta.env.PACKAGE_NAME": JSON.stringify(process.env.npm_package_name),
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(process.env.npm_package_version),
  },
  server: { port: 3000 },
  resolve: { preserveSymlinks: true },
  clearScreen: false,
});

/** The complete list of dependencies used in the project */
export const external = [
  // Builtin dependencies
  ...["electron", ...builtinModules.map((m) => [m, `node:${m}`]).flat()],
  // External dependencies
  ...Object.keys(pkg.dependencies || {}),
];

/**
 * Helper function for building the Vite config shared across the electron-forge processes
 * @type {(env: import('vite').ConfigEnv<'build'>) => import('vite').UserConfig}
 */
export const getBuildConfig = ({ root, mode, command }) => {
  return {
    root,
    mode,
    build: {
      // 🚧 Prevent multiple builds from interfering with each other.
      emptyOutDir: false,
      outDir: ".vite/build",
      watch: command === "serve" ? {} : null,
      minify: command === "build",
    },
    clearScreen: false,
  };
};

/**
 * Helper function for generating the keys used to build the "define" configuration
 * @type {(names: string[]) => { [name: string]: VitePluginRuntimeKeys } }
 */
export const getDefineKeys = (names) => {
  /** @type {{ [name: string]: VitePluginRuntimeKeys }} */
  const define = {};
  return names.reduce((acc, name) => {
    const NAME = name.toUpperCase();
    /** @type {VitePluginRuntimeKeys} */
    const keys = {
      VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
      VITE_NAME: `${NAME}_VITE_NAME`,
    };
    return { ...acc, [name]: keys };
  }, define);
};

/**
 * Plugin that enables hot reloading and hot restarting in the electron-forge processes
 * @type {(command: 'reload' | 'restart') => import('vite').Plugin}
 */
export const pluginHotRestart = (command) => {
  return {
    name: "@electron-forge/plugin-vite:hot-restart",
    closeBundle() {
      if (command === "reload") {
        for (const server of Object.values(process.viteDevServers)) {
          // Preload scripts hot reload.
          server.ws.send({ type: "full-reload" });
        }
      } else {
        // Main process hot restart: https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
        process.stdin.emit("data", "rs");
      }
    },
  };
};
