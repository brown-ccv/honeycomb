import { builtinModules } from "node:module";
import pkg from "./package.json";
import { defineConfig } from "vite";

export const builtins = ["electron", ...builtinModules.map((m) => [m, `node:${m}`]).flat()];

export const external = [...builtins, ...Object.keys(pkg.dependencies || {})];

/** @type {(env: import('vite').ConfigEnv<'build'>) => import('vite').UserConfig} */
export const getBuildConfig = (env) => {
  const { root, mode, command } = env;

  return {
    root,
    mode,
    build: {
      // Prevent multiple builds from interfering with each other.
      emptyOutDir: false,
      // 🚧 Multiple builds may conflict.
      outDir: ".vite/build",
      watch: command === "serve" ? {} : null,
      minify: command === "build",
    },
    clearScreen: false,
  };
};

/** @type {(names: string[]) => { [name: string]: VitePluginRuntimeKeys } }} */
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

/** @type {(name: string) => import('vite').Plugin} */
export const pluginExposeRenderer = (name) => {
  const { VITE_DEV_SERVER_URL } = getDefineKeys([name])[name];
  return {
    name: "@electron-forge/plugin-vite:expose-renderer",
    configureServer(server) {
      process.viteDevServers ??= {};
      // Expose server for preload scripts hot reload.
      process.viteDevServers[name] = server;
      server.httpServer?.once("listening", () => {
        /** @type {import('node:net').AddressInfo} */
        const addressInfo = server.httpServer?.address();
        // Expose env constant for main process use.
        process.env[VITE_DEV_SERVER_URL] = `http://localhost:${addressInfo?.port}`;
      });
    },
  };
};

/** @type {(command: 'reload' | 'restart') => import('vite').Plugin} */
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
        // Main process hot restart.
        // https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
        process.stdin.emit("data", "rs");
      }
    },
  };
};

/**
 * Base vite config shared between electron-forge and the browser
 */
export default defineConfig({
  base: "./",
  define: {
    "import.meta.env.PACKAGE_NAME": JSON.stringify(process.env.npm_package_name),
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 3000,
  },
  resolve: { preserveSymlinks: true },
  clearScreen: false,
});
