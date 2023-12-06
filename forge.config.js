/**
 * Configuration file for Electron Forge
 */
module.exports = {
  packagerConfig: {
    asar: true,
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
        // TODO #282: Certificates on mac and windows will prefect antivirus issues
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
