import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";

/** Configuration file for Electron Forge */
export default {
  packagerConfig: {
    asar: true,
    icon: "assets/icons/icon",
  },
  makers: [
    {
      // Windows Distribution
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl: "https://raw.githubusercontent.com/brown-ccv/honeycomb/main/assets/icons/icon.ico",
        setupIcon: "assets/icons/icon.ico",
      },
    },
    {
      // Mac Distribution
      name: "@electron-forge/maker-dmg",
      config: {
        icon: "assets/icons/icon.icns",
        overwrite: true,
      },
    },
    {
      // Linux Distribution
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "assets/icons/icon.png",
        },
      },
    },
    {
      // zip files
      name: "@electron-forge/maker-zip",
    },
  ],
  plugins: [
    { name: "@electron-forge/plugin-auto-unpack-natives", config: {} },
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          // Build files that run on the main process
          { entry: "src/electron/main.js", config: "vite.main.config.js" },
          // Build files that run on the preload process
          { entry: "src/electron/preload.js", config: "vite.preload.config.js" },
        ],
        renderer: [{ name: "main_window", config: "vite.renderer.config.js" }],
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    // TODO: Fuses configuration for Honeycomb
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
