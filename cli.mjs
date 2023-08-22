import { input, select, Separator } from "@inquirer/prompts";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// TODO: Handling importing code from inside Honeycomb?

/** -------------------- GLOBALS -------------------- */

let FIRESTORE; // reference to Firestore for the Honeycomb project (from Firebase Admin)

/** -------------------- MAIN -------------------- */

async function main() {
  // TODO: User should be able to pass command line arguments OR inquirer (especially for task)
  // const [, , ...args] = process.argv;

  const action = await select({
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

  switch (action) {
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

/** -------------------- DOWNLOAD ACTION -------------------- */

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
  const studyID = await studyIDPrompt("download");
  // console.log("downloadDataFirebase", studyID);
}

/** -------------------- DELETE ACTION -------------------- */

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
  const studyID = await studyIDPrompt("delete");
  console.log("deleteDataFirebase", studyID);
}

/** -------------------- PROMPTS -------------------- */

async function deploymentPrompt() {
  const response = await select({
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

  if (response === "firebase") {
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

  return response;
}

async function studyIDPrompt(action) {
  const response = await input({
    message: `Which study would you like to ${action}?`,
    // TODO: Validate studyID is in Firestore
    validate: async (value) => {
      const invalid = "Please enter a valid study from your Firestore database";
      if (!value) return invalid;
      // TODO: Add validation for studyID existing in Firestore
      // TODO: Currently an empty document so it doesn't actually exist in the database
      return true;
    },
  });

  return response;
}

async function participantIDPrompt(action) {
  const response = await input({
    message: `Which participant would you like to ${action}?`,
    // TODO: Validate studyID is in Firestore
    // TODO: Customize validation message
    validate: async (value) => {
      const invalid = "Please enter a valid study from your Firestore database";
      if (!value) return invalid;
      // TODO: Add validation for studyID existing in Firestore
      // TODO: Currently an empty document so it doesn't actually exist in the database
      return true;
    },
  });

  return response;
}

/** -------------------- FIRESTORE HELPERS -------------------- */
