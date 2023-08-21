/**
 * Connect to Firestore using a service account, and download participant response data.
 *
 *
 * Before using this you must set up a Firebase Service account: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#setting-up-a-service-account
 * For additional details about running the script: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#using-the-download-script
 */

// import fs from "fs-extra";
// import firebase from "firebase-admin";
import { Command } from "commander";
import { getFirestore } from "firebase-admin/firestore";
import { cert, initializeApp } from "firebase-admin/app";

// TODO: Refactor to modular format for firebase-admin
// TODO: Add option for passing a custom service account

let FIRESTORE;

// Run the download script using commander
const program = new Command();
program
  .name("firebase-download-data")
  .description("Downloads participant response data from Firebase")
  .argument("<studyID>", "The ID of a given study")
  .argument("<participantID>", "The ID of a given participant on the study")
  .argument(
    "[sessionNumber]",
    "Optional number used to select which session to download",
    // TODO: Just default to 0? Is that the most recent session?
    "latest"
  )
  .argument("[outputRoot]", "Optional path to the folder where data should be saved", ".")

  .showHelpAfterError()
  .action(async (studyID, participantID, sessionNumber, outputRoot) => {
    console.log(`Loading data for participant "${participantID}" on study "${studyID}"`);

    // TODO: What is the "latest" equivalent? That should be the default value
    if (sessionNumber !== "latest") sessionNumber = parseInt(sessionNumber);

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

    // Get the experiment documents from the reference
    const participantDataRef = FIRESTORE.collection(
      `participant_responses/${studyID}/participants/${participantID}/data`
    );
    const experiments = getParticipantData(participantDataRef);

    const experimentData = await getExperimentData(experiments, sessionNumber);
    // TODO: save experiment data
    try {
      await saveExperimentData(experimentData, outputRoot);
    } catch (error) {
      console.error("There was an error saving the data:");
      console.error(error);
    }
  })
  .parseAsync();

// Query Firestore for the participantID on the given studyID
async function getParticipantData(dataRef) {
  const dataSnapshot = await dataRef.get();
  const experiments = dataSnapshot.docs;

  // Summarize results
  if (experiments.length) {
    console.log(`Found ${experiments.length} session(s):`);
  } else {
    console.error("No sessions found!");
    process.exit();
  }
  experiments.forEach((experiment, idx) => console.log(`\t${idx}: ${experiment.id}`));
  console.log();

  return experiments;
}

async function getExperimentData(experiments, sessionNumber) {
  // TODO 172: Convert to new regex check for ID?
  if (isNaN(sessionNumber) || sessionNumber > experiments.length - 1) {
    console.log("Invalid session number, retrieving latest session");
    return experiments[experiments.length - 1];
  } else return experiments[sessionNumber];
}

async function saveExperimentData(experimentData, outputRoot) {
  console.log("saving", experimentData, outputRoot);
}
