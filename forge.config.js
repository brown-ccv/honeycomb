/**
 * Configuration file for Electron Forge
 */
module.exports = {
  packagerConfig: {
    asar: true,
    icon: "./assets/icons/icon",
  },
  makers: [
    {
      // Build zip files
      name: "@electron-forge/maker-zip",
    },
    {
      // Build for Linux
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: "/path/to/icon.png",
        },
      },
    },
    {
      // Build for Mac
      name: "@electron-forge/maker-dmg",
      config: {
        overwrite: true,
        icon: "./assets/icons/icon.icns",
      },
    },
    {
      // Build for Windows
      name: "@electron-forge/maker-squirrel",
      config: {
        iconUrl:
          "https://raw.githubusercontent.com/brown-ccv/honeycomb/main/assets/icons/win/icon.ico",
        setupIcon: "./assets/icons/icon.ico",

        // TODO: These are used in the example?
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERTIFICATE_PASSWORD,
      },
    },
  ],
  plugins: [
    {
      // https://www.electronforge.io/config/plugins/auto-unpack-natives
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
  ],
  publishers: [
    {
      // TODO: These might be nice for the end user? But not Honeycomb itself?
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "brown-ccv",
          name: "honeycomb",
        },
        prerelease: true,
      },
    },
  ],
};

// TODO: Should we add rpm installers?
// TODO: Add launch config for debugging in Electron? https://www.electronforge.io/advanced/debugging#debugging-with-vs-code
