import { select, Separator } from "@inquirer/prompts";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/** -------------------- GLOBALS -------------------- */

let FIRESTORE; // reference to Firestore for the Honeycomb project (from Firebase Admin)

/** -------------------- MAIN -------------------- */

async function main() {
  // TODO: User should be able to pass command line arguments OR inquirer (especially for task)
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
  switch (deployment) {
    case "firebase":
      await downloadDataFirebase();
      break;
  }
}

async function downloadDataFirebase() {
  initializeFirestore();
  console.log("downloadDataFirebase");
}

/** -------------------- DELETE -------------------- */

async function deleteData() {
  const deployment = await deploymentPrompt();

  console.log("Deleting data", deployment);
  switch (deployment) {
    case "firebase":
      await deleteDataFirebase();
      break;
  }
}

async function deleteDataFirebase() {
  initializeFirestore();
  console.log("deleteDataFirebase");
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

/** -------------------- FIRESTORE HELPERS -------------------- */

function initializeFirestore() {
  // Initialize Firestore
  try {
    const app = initializeApp({ credential: cert("firebase-service-account.json") });
    FIRESTORE = getFirestore(app);
  } catch (error) {
    throw new Error(
      "Unable to connect to Firebase\n\n" +
        'Your secret key must be called "firebase-service-account.json" ' +
        "and stored in the root of your repository.\n" +
        "More information: https://firebase.google.com/support/guides/service-accounts\n\n" +
        error.stack
    );
  }
}
