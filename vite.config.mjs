import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Security policy added to the built index.html (not the dev server, which needs inline scripts and a websocket for HMR)
 * default (images, media): No restrictions
 * script: Only content from within the app may be loaded
 * style: Only content from within the app may be loaded, but it may be loaded inline
 * fonts: Fonts may be loaded from within the app and via data sources
 */
const CONTENT_SECURITY_POLICY =
  "script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:";

/** Adds the Content-Security-Policy to index.html when building */
const contentSecurityPolicy = () => ({
  name: "honeycomb-content-security-policy",
  apply: "build",
  transformIndexHtml: () => [
    {
      tag: "meta",
      attrs: { "http-equiv": "Content-Security-Policy", content: CONTENT_SECURITY_POLICY },
      injectTo: "head-prepend",
    },
  ],
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentSecurityPolicy()],

  // Relative paths: Electron loads the app from the file system (file://)
  base: "./",

  // The .env.[mode] files live in env/ (e.g. `vite --mode clinic` loads env/.env.clinic)
  envDir: "env",

  server: { port: 5173, strictPort: true, open: false },
  build: { outDir: "dist" },
});
