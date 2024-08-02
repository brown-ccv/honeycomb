import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";

import baseConfig, { getDefineKeys } from "./vite.base.config.mjs";

/** Vite configuration for the render process */
export default defineConfig(({ forgeConfigSelf }) => {
  const name = forgeConfigSelf.name ?? "";
  return mergeConfig(baseConfig, {
    build: { outDir: `.vite/renderer/${name}` },
    plugins: [react(), pluginExposeRenderer(name)],
  });
});

/**
 * Plugin that exposes the renderer process to the electron-forge server
 * @type {(name: string) => import('vite').Plugin}
 */
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
