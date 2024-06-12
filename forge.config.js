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
  ],
  plugins: [
    { name: "@electron-forge/plugin-auto-unpack-natives", config: {} },
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          // Build files that use the main config
          { entry: "src/Electron/main.js", config: "vite.main.config.js" },
          // Build files that use the preload config
          { entry: "src/Electron/preload.js", config: "vite.preload.config.js" },
        ],
        renderer: [{ name: "main_window", config: "vite.renderer.config.js" }],
      },
    },
    {
      name: "@electron-forge/plugin-fuses",
      config: {
        version: FuseVersion.V1,
        [FuseV1Options.RunAsNode]: false, // Disables ELECTRON_RUN_AS_NODE
        [FuseV1Options.GrantFileProtocolExtraPrivileges]: true, // Grants the file protocol extra privileges (for the built application)
        [FuseV1Options.EnableCookieEncryption]: false, // Disables cookie encryption
        [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false, // Disables the NODE_OPTIONS environment variable
        [FuseV1Options.EnableNodeCliInspectArguments]: false, // Disables the --inspect and --inspect-brk family of CLI options
        [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true, // Enforces validation of the app.asar archive on macOS
        [FuseV1Options.OnlyLoadAppFromAsar]: true, // Enforces that Electron will only load your app from "app.asar" instead of its normal search paths
        [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: true, // Loads V8 Snapshot from `browser_v8_context_snapshot.bin` for the browser process
      },
    },
  ],
};
