/**
 * Retrieves the Git Commit SHA and Branch of the repository
 * The version file is written into public/version.json
 */
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

try {
  const git = {
    sha: execSync("git rev-parse HEAD").toString().trim(),
    ref: execSync("git branch --show-current").toString().trim(),
  };
  writeFileSync("public/version.json", JSON.stringify(git));
  console.log(`Saved version file with sha: ${git.sha}, branch: ${git.ref}`);
} catch (e) {
  console.error("Unable to determine git version");
  console.error(e);
}
