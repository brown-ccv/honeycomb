import { checkbox, confirm, expand, input, select } from "@inquirer/prompts";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fsExtra from "fs-extra";

/** -------------------- GLOBALS -------------------- */

let FIRESTORE; // Reference to Firestore for the Honeycomb project (from Firebase Admin)
let ACTION; // The action the user is attempting to complete
let DEPLOYMENT; // The deployment tool the user is using
let STUDY_ID; // The unique ID of a given study in the user's database
let PARTICIPANT_ID; // The ID of a given participant in the user's database
let EXPERIMENT_IDS; // The ID of a given experiment in the user's database
let OUTPUT_ROOT; // The root in which data is saved

const INVALID_ACTION_ERROR = new Error("Invalid action: " + ACTION);
const INVALID_DEPLOYMENT_ERROR = new Error("Invalid deployment: " + DEPLOYMENT);

/** -------------------- MAIN -------------------- */

async function main() {
  // TODO 289: User should be able to pass command line arguments OR inquirer (especially for action)

  ACTION = await actionPrompt();
  DEPLOYMENT = await deploymentPrompt();
  STUDY_ID = await studyIDPrompt();
  PARTICIPANT_ID = await participantIDPrompt();
  EXPERIMENT_IDS = await experimentIDPrompt();

  switch (ACTION) {
    case "download":
      OUTPUT_ROOT = await savePathPrompt();
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
      throw INVALID_ACTION_ERROR;
  }
}
main();

/** -------------------- DOWNLOAD ACTION -------------------- */

async function downloadDataFirebase() {
  let overwriteAll = false;

  // Download the files asynchronously, but sequentially
  for (const experimentID of EXPERIMENT_IDS) {
    // Get the data out of the experiment document
    const experimentRef = getExperimentRef(STUDY_ID, PARTICIPANT_ID, experimentID);
    const experimentSnapshot = await experimentRef.get();
    const experimentData = experimentSnapshot.data();

    // Check for nested trials subcollection
    const trialsSnapshot = await experimentRef.collection(TRIALS_COL).orderBy("trial_index").get();
    if (!trialsSnapshot.empty) {
      // Add the trials' data to the experiment's data as "results" array
      const trialsData = trialsSnapshot.docs.map((trial) => trial.data());
      experimentData["results"] = trialsData;
    } else {
      // Running in an older version of Honeycomb where "trials" subcollection doesn't exist
      // All experiment data used to be stored inside the experiment document -
      // In this case "results" is already inside the experimentData object
    }

    // Get the path of the file to be saved
    const outputFile =
      `${OUTPUT_ROOT}/${RESPONSES_COL}/` +
      `${STUDY_ID}/${PARTICIPANT_ID}/${experimentID}.json`.replaceAll(":", "_"); // (":" are replaced to prevent issues with invalid file names)

    // Determine if the file should be saved
    // TODO 300: Download as either CSV or JSON
    let shouldDownload;
    if (fsExtra.existsSync(outputFile)) {
      // File exists, check if user wants to overwrite
      const answer = await confirmOverwritePrompt(outputFile, overwriteAll);
      switch (answer) {
        case "all":
          overwriteAll = true;
          shouldDownload = true;
          break;
        case "yes":
          shouldDownload = true;
          break;
        default:
          shouldDownload = false;
          break;
      }
    } else {
      // File doesn't exist locally - safe to download
      shouldDownload = true;
    }

    if (overwriteAll || shouldDownload) {
      // Save the session to a unique JSON file.
      try {
        fsExtra.outputJSONSync(outputFile, experimentData, { spaces: 2 });
        console.log(`Data saved successfully: ${outputFile}`);
      } catch (error) {
        console.error(`There was an error saving ${outputFile}`);
      }
    } else console.log("Skipping download");
  }
}

/** -------------------- DELETE ACTION -------------------- */

async function deleteDataFirebase() {
  const confirmation = await confirmDeletionPrompt();
  if (confirmation) {
    await Promise.all(
      EXPERIMENT_IDS.map(async (experimentID) => {
        const experimentRef = getExperimentRef(STUDY_ID, PARTICIPANT_ID, experimentID);
        try {
          FIRESTORE.recursiveDelete(experimentRef);
          console.log("Successfully deleted:", experimentRef.id);
        } catch (error) {
          console.error("There was an error deleting", experimentRef.id);
        }
      })
    );
  } else console.log("Skipping deletion");
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
  // TODO 290: Add other deployments!
  const response = "firebase";

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

  return await input({
    // TODO 291: Enable downloading all study data at once
    message: "Select a participant:",
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

/** Prompt the user to select one or more experiments of the PARTICIPANT_ID on STUDY_ID */
async function experimentIDPrompt() {
  // TODO 291: Enable downloading all participant data at once
  const dataSnapshot = await getDataRef(STUDY_ID, PARTICIPANT_ID).get();

  // Sort experiment choices by most recent first
  const choices = dataSnapshot.docs
    .sort()
    .reverse()
    .map(({ id }) => ({ name: id, value: id }));

  return await checkbox({
    message: `Select the sessions you would like to ${ACTION}:`,
    choices: choices,
  });
}

/** Prompts the user for a file path */
async function savePathPrompt() {
  const invalidMessage = "Path does not exist";
  return await input({
    message: "Where would you like to save the data?",
    default: ".",
    validate: async (input) => {
      try {
        const maybePath = fsExtra.statSync(input);
        if (!maybePath.isDirectory()) return invalidMessage;
      } catch (e) {
        return invalidMessage;
      }
      return true;
    },
  });
}

/** Prompts the user to confirm continuation of the CLI */
async function confirmDeletionPrompt() {
  const numExperiments = EXPERIMENT_IDS.length;
  return confirm({
    message: `Continue? (${numExperiments} ${
      numExperiments !== 1 ? "experiments" : "experiment"
    } will be deleted)`,
    default: false,
  });
}

/**
 * Prompts the user to confirm continuation of the CLI, including future conflicts
 * @param {string} outputFile
 * @param {boolean} overwriteAll Whether or not all was already selected
 * @returns
 */
async function confirmOverwritePrompt(file, overwriteAll) {
  if (overwriteAll) return "yes"; // User already confirmed overwrite of all files

  const answer = await expand({
    message: `${file} already exists. Overwrite?`,
    default: "n",
    expanded: true,
    choices: [
      {
        key: "y",
        name: "Overwrite this file",
        value: "yes",
      },
      {
        key: "a",
        name: "Overwrite all files",
        value: "all",
      },
      {
        key: "n",
        name: "Skip this file",
        value: "no",
      },
    ],
  });
  return answer;
}

/** -------------------- FIRESTORE HELPERS -------------------- */

const RESPONSES_COL = "participant_responses";
const PARTICIPANTS_COL = "participants";
const DATA_COL = "data";
const TRIALS_COL = "trials";

// Get a reference to a study document in Firestore
const getStudyRef = (studyID) => FIRESTORE.collection(RESPONSES_COL).doc(studyID);

// Get a reference to a participant document in Firestore
const getParticipantRef = (studyID, participantID) =>
  getStudyRef(studyID).collection(PARTICIPANTS_COL).doc(participantID);

// Get a reference to a participant's data collection in Firestore
const getDataRef = (studyID, participantID) =>
  getParticipantRef(studyID, participantID).collection(DATA_COL);

// Get a reference to a participant's specific experiment data document in Firestore
const getExperimentRef = (studyID, participantID, experimentID) =>
  getDataRef(studyID, participantID).doc(experimentID);
