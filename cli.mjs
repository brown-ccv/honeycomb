import { select, Separator } from "@inquirer/prompts";

// TODO: User should be able to pass command line arguments OR inquirer (especially for task)

async function main() {
  // const [, , ...args] = process.argv;

  const task = await select({
    message: "What would you like to do?",
    choices: [
      {
        name: "Download data",
        value: "download",
      },
      {
        name: "Delete data",
        value: "delete",
      },
    ],
  });

  switch (task) {
    case "download":
      await downloadData();
      break;
    case "delete":
      await deleteData();
      break;
  }
}
main();

// `Enter participant id: (* to download all data for the study "${studyID}`)
// Same for sessions on a participant

/** -------------------- DOWNLOAD -------------------- */

async function downloadData() {
  const deployment = await deploymentPrompt();
  console.log("Downloading data", deployment);
}

/** -------------------- DELETE -------------------- */

async function deleteData() {
  const deployment = await deploymentPrompt();
  console.log("Deleting data", deployment);
}

/** -------------------- HELPERS -------------------- */

async function deploymentPrompt() {
  const deployment = await select({
    message: "Which deployment are you using?",
    choices: [
      {
        name: "Firebase",
        value: "firebase",
        description: "Data is saved on the Firestore database",
      },
      new Separator(),
      // TODO: Add other deployments!
      {
        name: "",
        value: "",
        description: "Data is saved on your local machine",

        disabled: "Working with local data is not yet supported",
      },
    ],
  });

  // TODO: Instantiate Firebase if using Firebase
  return deployment;
}
