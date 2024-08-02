import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite";

import baseConfig from "./vite.base.config.mjs";

/** Vite configuration used when running in the browser */
export default defineConfig(mergeConfig(baseConfig, defineConfig({ plugins: [react()] })));
