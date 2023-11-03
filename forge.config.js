/**
 * Configuration file for Electron Forge
 */
module.exports = {
  packagerConfig: {
    asar: true,
    // TODO: Honeycomb icon (hexagon on docs)
    icon: "assets/icons/icon",
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
          // TODO: Honeycomb icon (hexagon on docs)
          // icon: "assets/icons/icon.png",
        },
      },
    },
    {
      // Mac Distribution
      name: "@electron-forge/maker-dmg",
      config: {
        // TODO: Honeycomb icon (hexagon on docs)
        icon: "assets/icons/icon.icns",
        overwrite: true,
      },
      platforms: ["darwin"],
    },
    {
      // Windows Distribution
      name: "@electron-forge/maker-squirrel",
      config: {
        // TODO: Honeycomb icon (hexagon on docs)
        // TODO: This will break when we merge with main
        iconUrl:
          "https://raw.githubusercontent.com/brown-ccv/honeycomb/main/assets/icons/win/icon.ico",
        setupIcon: "assets/icons/icon.ico",
        // TODO: Certificates on mac and windows will prefect antivirus issues
        // certificateFile: "./cert.pfx",
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
};
