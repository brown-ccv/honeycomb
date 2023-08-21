/**
 * Connect to Firestore and delete participant response data.
 *
 *
 * Before using this you must set up a Firebase Service account: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#setting-up-a-service-account
 * For additional details about running the script: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#using-the-download-script
 */
import { Command } from "commander";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let FIRESTORE;

// Run the download script using commander
const program = new Command();
program
  .name("firebase-delete-data")
  .description("Deletes participant response data from Firebase")
  .argument("<studyID>", "The ID of a given study")
  .argument("<participantID>", "The ID of a given participant on the study")
  .argument(
    "[sessionNumber]",
    "Optional number used to select which session to delete, defaults to all sessions"
  )
  .showHelpAfterError()
  .action(async (studyID, participantID, sessionNumber) => {
    console.log(`Loading data for participant "${participantID}" on study "${studyID}"`);

    // Initialize Firestore
    // TODO: Add as utility function?
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
    await deleteExperiment(experiments, sessionNumber);
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

async function deleteExperiment(experiments, sessionNumber) {
  let toDelete = [];
  if (sessionNumber == undefined) {
    console.log("No session number given, will delete all sessions");
    toDelete = experiments;
  } else if (isNaN(sessionNumber) || sessionNumber > experiments.length - 1) {
    console.error("Invalid session number:", sessionNumber);
    process.exit();
  } else {
    toDelete.push(experiments[sessionNumber]);
  }

  console.log(toDelete.length);
  // Prompt user to allow deletion
}
