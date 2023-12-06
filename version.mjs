// Get Git Commit SHA and Branch
// TODO #173: Is there a better way to keep track of versioning? Just use x.x.x?

import fsExtra from "fs-extra";
import { execaCommandSync } from "execa";

let git;

if (process.env.CI) {
  const sha = process.env.GITHUB_SHA;
  const ref = process.env.GITHUB_REF;
  git = { sha, ref };
} else {
  const sha = execaCommandSync("git rev-parse HEAD").stdout;
  const ref = execaCommandSync("git branch --show-current").stdout;
  git = { sha, ref };
}

fsExtra
  .writeFile("public/config/version.json", JSON.stringify(git))
  .then(() => console.log(`Saved version file with rev: ${git.sha}, branch: ${git.ref}`))
  .catch((error) => console.log(error));
