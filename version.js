/**
 * Get Git Commit SHA and Branch
 * The version file is written into electron/version.json
 */

import fsExtra from "fs-extra";
import { execaSync } from "execa";

let git;

if (process.env.CI) {
  const sha = process.env.GITHUB_SHA;
  const ref = process.env.GITHUB_REF;
  git = { sha, ref };
} else {
  const sha = execaSync`git rev-parse HEAD`.stdout;
  const ref = execaSync`git branch --show-current`.stdout;
  git = { sha, ref };
}

fsExtra
  .writeFile("electron/version.json", JSON.stringify(git))
  .then(() => console.log(`Saved version file with rev: ${git.sha}, branch: ${git.ref}`))
  .catch((error) => console.log(error));
