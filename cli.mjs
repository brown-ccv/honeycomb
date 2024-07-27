import { checkbox, confirm, expand, input, select } from "@inquirer/prompts";
import fsExtra from "fs-extra";

// TODO @brown-ccv #183: Upgrade to modular SDK instead of compat
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Command } from "commander";

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

/** -------------------- COMMANDER -------------------- */
const commander = new Command();
// default: [download | delete ] not provided, run main() as usual continuing with prompting
commander.action(() => {});

// download: optional argument studyID and participantID skips relative prompts
commander
  .command(`download`)
  .argument(`[studyID]`)
  .argument(`[participantID]`)
  .description(`Download experiment data from Firebase provided study ID and participant ID`)
  .action((studyID, participantID) => {
    ACTION = "download";
    STUDY_ID = studyID;
    PARTICIPANT_ID = participantID;
  });

// delete: optional argument studyID and participantID skips relative prompts
commander
  .command(`delete`)
  .argument(`[studyID]`)
  .argument(`[participantID]`)
  .description(`Delete experiment data from Firebase provided study ID and participant ID`)
  .action((studyID, participantID) => {
    ACTION = "delete";
    STUDY_ID = studyID;
    PARTICIPANT_ID = participantID;
  });

// register: optional argument studyID and participantID skips relative prompts
commander
  .command(`register`)
  .argument(`[studyID]`)
  .argument(`[participantID]`)
  .description(`Register new partipant under study provided a partipantID and studyID`)
  .action((studyID, participantID) => {
    ACTION = "register";
    STUDY_ID = studyID;
    PARTICIPANT_ID = participantID;
  });

commander.parse();

// print message if download or delete provided, along with optional args provided
if (ACTION != undefined) {
  console.log(
    `${ACTION} data from Firebase ${STUDY_ID == undefined ? "" : `given study ID: ${STUDY_ID}`} ${PARTICIPANT_ID == undefined ? "" : `and participant ID: ${PARTICIPANT_ID}`}`
  );
}

/** -------------------- MAIN -------------------- */

// TODO @brown-ccv #289: Pass CLI arguments with commander (especially for action)
async function main() {
  if (ACTION == undefined) {
    ACTION = await actionPrompt();
  }
  DEPLOYMENT = await deploymentPrompt();
  // TODO @brown-ccv #291: Enable downloading all study data at once
  if (STUDY_ID == undefined) {
    STUDY_ID = await studyIDPrompt();
  }
  // TODO @brown-ccv #291: Enable downloading all participant data at once
  if (PARTICIPANT_ID == undefined) {
    PARTICIPANT_ID = await participantIDPrompt();
  }
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
    case "register":
      switch (DEPLOYMENT) {
        case "firebase":
          await registerDataFirebase(STUDY_ID, PARTICIPANT_ID);
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

/** Download data that's stored in Firebase */
// TODO @brown-ccv #300: Download as either CSV or JSON
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

/** Delete data that's stored in Firebase */
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

/** -------------------- REGISTER ACTION -------------------- */

/** Register new data, write to Firestore */
async function registerDataFirebase(studyID, participantID) {
  const confirmation = await confirmRegisterPrompt(studyID, participantID);
  if (confirmation) {
    try {
      await addStudyAndParticipant(studyID, participantID);
    } catch (error) {
      console.error(
        `Unable to register new participant with participantID ${participantID} under studyID ${studyID}: ` +
          error
      );
    }
  } else console.log("Skipping registration");
  return true;
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
        name: "Register new participant under study",
        value: "register",
      },
      {
        name: "Delete data",
        value: "delete",
      },
    ],
  });
}

/** Prompt the user for the deployment they are trying to access */
// TODO @brown-ccv #290: Add other deployments!
async function deploymentPrompt() {
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
      if (ACTION == "register") {
        STUDY_ID = input;
        return true;
      }
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
    message: ACTION == "register" ? "Enter a new participant:" : "Select a participant:",
    validate: async (input) => {
      const invalid = "Please enter a valid participant from your Firestore database";
      if (!input) return invalid;
      else if (input === "*") return true;
      if (ACTION == "register") {
        PARTICIPANT_ID = input;
        return true;
      }
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
  // register: adding/checking for existing new studies will be done in function
  if (ACTION == "register") {
    return;
  }

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

async function confirmRegisterPrompt(studyID, participantID) {
  const currentParticipants = await getRegisteredParticipantArr(studyID);
  const currentParticipantMessage =
    currentParticipants.length == 0
      ? "Currently, there are no participants under this study\n"
      : `Currently, the participants under this study include: \n${currentParticipants.join("\n")}\n`;
  return confirm({
    message:
      currentParticipantMessage +
      `Continue? adding study with studyID: ${studyID} and participant ID: ${participantID}`,
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
const REG_STUDY_COL = "registered_studies";
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

// Get a reference to a registered study
const getRegisteredfStudyRef = (studyID) => FIRESTORE.collection(REG_STUDY_COL).doc(studyID);

// Get current registered participant array under the StudyID
const getRegisteredParticipantArr = (studyID) => {
  const res = getRegisteredfStudyRef(studyID)
    .get()
    .then((data) => {
      if (data["_fieldsProto"] != undefined) {
        return data["_fieldsProto"]["registered_participants"]["arrayValue"]["values"]
          .filter((item) => item.valueType === "stringValue")
          .map((item) => item.stringValue);
      } else {
        return [];
      }
    });

  return res;
};

// Register new participantID under the provided studyID
const registerNewParticipant = async (studyID, participantID) => {
  const currParticipants = await getRegisteredParticipantArr(studyID);
  const newParticipantArray = [...currParticipants, participantID];
  const newData = { registered_participants: newParticipantArray };
  getRegisteredfStudyRef(studyID).update(newData);
  console.log(
    `Successfully added study and participant. Current participantIDs under study ${studyID}: \n${newParticipantArray.join("\n")}`
  );
};

// Add new participantID under studyID to Firestore under registered_studies,
//  creates new study if studyID doesn't exist
const addStudyAndParticipant = async (studyID, participantID) => {
  getRegisteredfStudyRef(studyID)
    .get()
    .then((data) => {
      // study not initated yet
      if (data["_fieldsProto"] == undefined) {
        getRegisteredfStudyRef(studyID)
          .set({ registered_participants: [] })
          .then(() => {
            registerNewParticipant(studyID, participantID);
          });
      } else {
        // study initiated, add to array holding registered participants
        registerNewParticipant(studyID, participantID);
      }
    });
};
