import { checkbox, input, select } from "@inquirer/prompts";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// TODO: Handling importing code from inside Honeycomb?
// ? TODO: Some of the prompt messages could use some flushing out?

/** -------------------- GLOBALS -------------------- */

let FIRESTORE; // Reference to Firestore for the Honeycomb project (from Firebase Admin)
let ACTION; // The action the user is attempting to complete
let DEPLOYMENT; // The deployment tool the user is using
let STUDY_ID; // The unique ID of a given study in the user's database
let PARTICIPANT_IDS; // The ID of a given participant in the user's database
let EXPERIMENT_IDS; // The ID of a given experiment in the user's database

const INVALID_DEPLOYMENT_ERROR = new Error("Invalid deployment: " + DEPLOYMENT);

/** -------------------- MAIN -------------------- */

async function main() {
  // TODO: User should be able to pass command line arguments OR inquirer (especially for action)
  // const [, , ...args] = process.argv;

  ACTION = await actionPrompt();
  DEPLOYMENT = await deploymentPrompt();
  STUDY_ID = await studyIDPrompt();
  PARTICIPANT_IDS = await participantIDPrompt();
  EXPERIMENT_IDS = await experimentIDPrompt();

  switch (ACTION) {
    case "download":
      switch (DEPLOYMENT) {
        case "firebase":
          await downloadDataFirebase();
          break;
        default:
          throw INVALID_DEPLOYMENT_ERROR;
      }
      break;
    case "delete":
      switch (DEPLOYMENT) {
        case "firebase":
          await deleteDataFirebase();
          break;
        default:
          throw INVALID_DEPLOYMENT_ERROR;
      }
      break;
    default:
      throw new Error("Invalid action: " + ACTION);
  }
}
main();

/** -------------------- DOWNLOAD ACTION -------------------- */

async function downloadDataFirebase() {
  console.log("Downloading data firebase: ", STUDY_ID, PARTICIPANT_IDS, EXPERIMENT_IDS);

  // TODO: Enable downloading all study data at once
  const participants = PARTICIPANT_IDS;

  // Get list of participants to download
  // Get list of studies on each participant to download
}

/** -------------------- DELETE ACTION -------------------- */

async function deleteDataFirebase() {
  console.log("Deleting data: ", DEPLOYMENT, STUDY_ID, PARTICIPANT_IDS, EXPERIMENT_IDS);
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
    // subcollection is programmatically generated, if it doesn't exist then input must not be a valid studyID
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
        default:
          throw INVALID_DEPLOYMENT_ERROR;
      }
    },
  });
}

/** Prompt the user to enter the ID of a participant on the STUDY_ID study */
async function participantIDPrompt() {
  const invalidMessage = `Please enter a valid participant on the study "${STUDY_ID}"`;
  const validateParticipantFirebase = async (input) => {
    // subcollection is programmatically generated, if it doesn't exist then input must not be a valid participantID
    const studyIDCollections = await getParticipantRef(STUDY_ID, input).listCollections();
    return studyIDCollections.find((c) => c.id === DATA_COL) ? true : invalidMessage;
  };

  // TODO: Enable downloading all study data at once
  return await input({
    // message: "Select a participant (* selects all ):", // ? Do we need the stuff in parentheses?
    message: "Select a participant: ",
    // default: "*",
    validate: async (input) => {
      const invalid = "Please enter a valid participant from your Firestore database";
      if (!input) return invalid;
      else if (input === "*") return true;

      switch (DEPLOYMENT) {
        case "firebase":
          return validateParticipantFirebase(input);
        default:
          throw INVALID_DEPLOYMENT_ERROR;
      }
    },
  });
}

/** Prompt the user to select one or more experiments of the PARTICIPANT_IDS on STUDY_ID */
async function experimentIDPrompt() {
  // if (PARTICIPANT_IDS === "*") return "*"; // Download all experiments for all participants

  const dataSnapshot = await getDataRef(STUDY_ID, PARTICIPANT_IDS).get();
  const experiments = dataSnapshot.docs;
  const choices = [...experiments.map(({ id }) => ({ name: id, value: id }))];

  return await checkbox({
    // TODO: What's the right word for this? Trial?
    message: `Select the experiments you would like to ${ACTION}:`,
    choices: choices,
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

// Get a reference to a participant's data collection in Firestore
const getDataRef = (studyID, participantID) =>
  getStudyRef(studyID).collection(PARTICIPANTS_COL).doc(participantID).collection(DATA_COL);

/** -------------------- UTILS -------------------- */
