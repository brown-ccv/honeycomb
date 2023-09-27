const { config } = require("../src/config/main");

/**
 * Preload script run before the renderer process is loaded
 */
window.addEventListener("DOMContentLoaded", () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector);
  //   if (element) element.innerText = text;
  // };
  console.log(config);

  for (const dependency of ["chrome", "node", "electron"]) {
    console.log(`${dependency}-version`, process.versions[dependency]);
  }
});
