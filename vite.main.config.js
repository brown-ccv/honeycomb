import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Load our native node modules
    rollupOptions: { external: ["serialport"] },
  },
});
