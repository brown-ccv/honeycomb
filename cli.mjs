import { input, select, Separator } from "@inquirer/prompts";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// TODO: Handling importing code from inside Honeycomb?
// ? TODO: Some of the prompt messages could use some flushing out?

/** -------------------- GLOBALS -------------------- */

let FIRESTORE; // Reference to Firestore for the Honeycomb project (from Firebase Admin)
// TODO: Remove these
let ACTION; // The action the user is attempting to complete
let DEPLOYMENT; // The deployment tool the user is using
let STUDY_ID; // The unique ID of a given study in the user's database
let PARTICIPANT_ID; // The ID of a given participant in the user's database
let EXPERIMENT_ID; // The ID of a given experiment in the user's database

/** -------------------- MAIN -------------------- */

async function main() {
  // TODO: User should be able to pass command line arguments OR inquirer (especially for action)
  // const [, , ...args] = process.argv;

  ACTION = await actionPrompt();
  DEPLOYMENT = await deploymentPrompt();
  STUDY_ID = await studyIDPrompt();
  PARTICIPANT_ID = await participantIDPrompt();

  switch (ACTION) {
    case "download":
      switch (DEPLOYMENT) {
        case "firebase":
          await downloadDataFirebase();
          break;
        default:
          throw new Error("Invalid deployment: " + DEPLOYMENT);
      }
      break;
    case "delete":
      switch (DEPLOYMENT) {
        case "firebase":
          await deleteDataFirebase();
          break;
        default:
          throw new Error("Invalid deployment: " + DEPLOYMENT);
      }
      break;
    default:
      throw new Error("Invalid action: " + ACTION);
  }
}
main();

/** -------------------- DOWNLOAD ACTION -------------------- */

async function downloadDataFirebase() {
  console.log("Downloading data", DEPLOYMENT);
  // switch (DEPLOYMENT) {
  //   case "firebase":
  //     await downloadDataFirebase();
  //     break;
  // }
}

/** -------------------- DELETE ACTION -------------------- */

async function deleteDataFirebase() {
  console.log("Deleting data", DEPLOYMENT);
  // switch (DEPLOYMENT) {
  //   case "firebase":
  //     await deleteDataFirebase();
  //     break;
  //   default:
  //     console.error("Invalid deployment:", DEPLOYMENT);
  //     process.exit();
  // }
}

/** -------------------- PROMPTS -------------------- */

/** Prompt the user for the action they are trying to complete */
async function actionPrompt() {
  return await select({
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
}

/** Prompt the user for the deployment they are trying to access */
async function deploymentPrompt() {
  const response = await select({
    message: "Which deployment are you using?",
    choices: [
      {
        name: "Firebase",
        value: "firebase",
        description: "Data is saved on the Firestore database",
      },
      // TODO: Add other deployments!
      // {
      //   // Note that downloading local data will never make sense - conditionally add prompt
      //   name: "Local data",
      //   value: "local",
      //   description: "Data is saved on your local machine",
      //   disabled: "(Working with local data is not yet supported)",
      // },
    ],
  });

  // Initialize Firestore
  if (response === "firebase") {
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

/** Prompt the user to enter the ID of a study */
async function studyIDPrompt() {
  const invalidMessage = "Please enter a valid study from your Firestore database";
  const validateStudyFirebase = async (input) => {
    // participants subcollection is programmatically generated
    // if it doesn't exist then input must not be a valid studyID
    const studyIDCollections = await getStudyRef(input).listCollections();
    return studyIDCollections.find((c) => c.id === PARTICIPANTS_COL) ? true : invalidMessage;
  };

  return await input({
    message: "Select a study:",
    validate: async (input) => {
      if (!input) return invalidMessage;
      switch (DEPLOYMENT) {
        case "firebase":
          return validateStudyFirebase(input);
      }
    },
  });
}

/** Prompt the user to enter the ID of a participant on the STUDY_ID study */
async function participantIDPrompt() {
  const invalidMessage = `Please enter a valid participant on the study "${STUDY_ID}"`;
  const validateParticipantFirebase = async (input) => {
    // data subcollection is programmatically generated
    // if it doesn't exist then input must not be a valid participantID
    const studyIDCollections = await getParticipantRef(STUDY_ID, input).listCollections();
    return studyIDCollections.find((c) => c.id === DATA_COL) ? true : invalidMessage;
  };

  return await input({
    message: "Select a participant (* selects all ):", // ? Do we need the stuff in parentheses?
    default: "*",
    description: "this is a etst",
    validate: async (input) => {
      const invalid = "Please enter a valid participant from your Firestore database";
      if (!input) return invalid;
      else if (input === "*") return true;
      switch (DEPLOYMENT) {
        case "firebase":
          return validateParticipantFirebase(input);
      }
    },
  });
}

/** -------------------- FIRESTORE HELPERS -------------------- */

const RESPONSES_COL = "participant_responses";
const PARTICIPANTS_COL = "participants";
const DATA_COL = "data";

// Get a reference to a study document in Firestore
const getStudyRef = (studyID) => FIRESTORE.collection(RESPONSES_COL).doc(studyID);

// Get a reference to a participant document in Firestore
const getParticipantRef = (studyID, participantID) =>
  getStudyRef(studyID).collection(PARTICIPANTS_COL).doc(participantID);
