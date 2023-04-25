// Get Git Commit SHA and Branch
// TODO 173: Is there a better way to keep track of versioning? Just use x.x.x?

const fs = require('fs-extra');
const execa = require('execa');

let git;

if (process.env.CI) {
  const sha = process.env.GITHUB_SHA;
  const ref = process.env.GITHUB_REF;
  git = { sha, ref };
} else {
  const sha = execa.commandSync('git rev-parse HEAD').stdout;
  const ref = execa.commandSync('git branch --show-current').stdout;
  git = { sha, ref };
}

fs.writeFile('public/config/version.json', JSON.stringify(git))
  .then(() => console.log(`Saved version file with rev: ${git.sha}, branch: ${git.ref}`))
  .catch((error) => console.log(error));
