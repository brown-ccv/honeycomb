/**
 * Configuration file for Electron Forge
 */

// Only these paths are packaged into the app: the Vite build, the Electron main process, and the window icon.
// Production dependencies (node_modules) are pruned and included by Electron Forge itself.
const PACKAGED_PATHS =
  /^\/(dist|electron|node_modules)(\/|$)|^\/assets(\/icons(\/|$)|$)|^\/package\.json$/;

module.exports = {
  packagerConfig: {
    asar: true,
    icon: "assets/icons/icon",
    // Return true to ignore a file (paths are relative to the project root and start with "/")
    ignore: (file) => file !== "" && !PACKAGED_PATHS.test(file),
  },
  rebuildConfig: {
    // serialport is a Node-API module that ships prebuilt binaries for every OS/arch we target.
    // Node-API binaries work in Electron without recompiling, so skip the node-gyp rebuild (no Python/C++ toolchain needed)
    ignoreModules: ["@serialport/bindings-cpp"],
  },
  makers: [
    {
      // zip files
      name: "@electron-forge/maker-zip",
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
      // Mac Distribution
      name: "@electron-forge/maker-dmg",
      config: {
        icon: "assets/icons/icon.icns",
        overwrite: true,
      },
    },
    {
      // Windows Distribution
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl: "https://raw.githubusercontent.com/brown-ccv/honeycomb/main/assets/icons/icon.ico",
        setupIcon: "assets/icons/icon.ico",
      },
    },
  ],
  plugins: [{ name: "@electron-forge/plugin-auto-unpack-natives", config: {} }],
};
