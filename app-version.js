// Get the version of this app.
// Webpack >3 yells when we do a named import from package.json:
// "Should not import the named export 'version' (imported as 'version') from default-exporting module (only default export is available soon)"
// We could grab the whole thing as default import, but this might expose all of package.json to the client and is a security not-best-practice.
// Instead, this script scrapes out just the app name and version which we can then consume as a default import in config.

const fs = require('fs-extra')
const packageInfo = require('./package.json')


const app = {
    name: packageInfo.name,
    version: packageInfo.version
}

fs.writeFile('src/config/app-version.json', JSON.stringify(app))
  .then(() => {
      console.log(`Saved app version file with name: ${app.name}, version: ${app.version}`);
  })
  .catch((err) => {
      console.log(err);
  });
