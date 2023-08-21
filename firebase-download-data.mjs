/**
 * Connect to Firestore and download participant response data.
 *
 *
 * Before using this you must set up a Firebase Service account: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#setting-up-a-service-account
 * For additional details about running the script: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#using-the-download-script
 */

import { Command } from "commander";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs-extra";

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
    "Optional number used to select which session to download, defaults to latest session"
    // TODO: Just default to 0? Is that the most recent session?
    // "-1"
  )
  .argument("[outputRoot]", "Optional path to the folder where data should be saved", ".")

  .showHelpAfterError()
  .action(async (studyID, participantID, sessionNumber, outputRoot) => {
    console.log(`Loading data for participant "${participantID}" on study "${studyID}"`);

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
    const experiments = await getExperiments(participantDataRef);

    const experimentDoc = await getExperiment(experiments, sessionNumber);
    const trialsData = await getTrialsData(participantDataRef, experimentDoc);

    await saveExperimentData(experimentDoc, trialsData, studyID, participantID, outputRoot);
  })
  .parseAsync();

// Query Firestore for the participantID on the given studyID
async function getExperiments(dataRef) {
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

async function getExperiment(experiments, sessionNumber) {
  // TODO 172: Convert to new regex check for ID?
  // TODO: Retrieve all sessions if sessionNumber isn't given?

  if (sessionNumber == undefined) {
    console.log("Retrieving latest session");
    return experiments[experiments.length - 1];
  } else if (isNaN(sessionNumber) || sessionNumber > experiments.length - 1) {
    console.error("Invalid session number:", sessionNumber);
    process.exit();
  } else {
    console.log("Loading session", sessionNumber);
    return experiments[sessionNumber];
  }
}

async function getTrialsData(participantDataRef, experimentDoc) {
  const id = experimentDoc.id;

  // Merge the experiment's trials' data into a single array
  const trialsSnapshot = await FIRESTORE.collection(`${participantDataRef.path}/${id}/trials`)
    .orderBy("trial_index")
    .get();
  return trialsSnapshot.docs.map((trial) => trial.data());
}

async function saveExperimentData(experimentDoc, trialsData, studyID, participantID, outputRoot) {
  // Add the trials' data to the experiment's data as "results" array
  const experimentData = experimentDoc.data();
  experimentData.results = trialsData;

  // Save the session to a unique JSON file. (":" are replaced to prevent issues with invalid file names)
  const outputFile =
    `${outputRoot}/participant_responses/` +
    `${studyID}/${participantID}/${experimentDoc.id}.json`.replaceAll(":", "_");

  // TODO 172: Check for overwriting file?
  try {
    fs.outputJson(outputFile, experimentData, { spaces: 2 });
    console.log("Data saved to disk at", outputFile);
  } catch (error) {
    throw new Error("There was an error saving the data:\n\n" + error.stack);
  }
}
