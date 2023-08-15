/**
 * Connect to Firestore using a service account, and download participant response data.
 *
 * Usage:
 *   npm run firebase:download -- studyID participantID [sessionNumber] [outputRoot]
 *
 * studyID: The ID of a given study
 * participantID: The ID of a given participant on the `studyID` study
 * sessionNumber: Optional number to select which session to download, defaults to the most recent session
 * outputRoot: Optional path to the folder where data should be saved, defaults to the current folder
 *
 * Before using this you must set up a Firebase Service account: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#setting-up-a-service-account
 * For additional details about running the script: https://brown-ccv.github.io/honeycomb-docs/docs/firebase#using-the-download-script
 */

// TODO 172: Refactor to a CJS module
const fs = require("fs-extra");
const firebase = require("firebase-admin");

// Get CLI arguments
const args = process.argv.slice(2);
const studyID = args[0];
const participantID = args[1];
const sessionNumber = parseInt(args[2]);
const outputRoot = args[3] || ".";

if (studyID === undefined || participantID === undefined) {
  // Note that throwing an Error will halt execution of this script
  throw Error(
    "studyID and participantID not given\n" +
      "Usage: npm run firebase:download -- studyID participantID [sessionNumber] [outputRoot]\n"
  );
} else {
  console.log(
    `Looking for response data for study <${studyID}>, participant <${participantID}>, ` +
      `sessionNumber <${sessionNumber}>, outputRoot <${outputRoot}>.\n`
  );
}

// Initialize Firestore
let db;
try {
  db = firebase
    .initializeApp({
      credential: firebase.credential.cert(require("./firebase-service-account.json")),
    })
    .firestore();
} catch (error) {
  throw new Error(
    "Unable to connect to Firebase\n\n" +
      'Your secret key must be called "firebase-service-account.json" ' +
      "and stored in the root of your repository.\n" +
      // TODO 42d: Add Firebase Service Account info to docs
      "More information: https://firebase.google.com/support/guides/service-accounts\n\n" +
      error.stack
  );
}

// Query Firestore for the participantID on the given studyID
const dataRef = db.collection(
  `participant_responses/${studyID}/participants/${participantID}/data`
);
dataRef
  .get()
  .then((dataSnapshot) => {
    const experiments = dataSnapshot.docs;

    // Summarize results
    if (experiments) console.log(`Found ${experiments.length} session(s):`);
    else throw new Error("No sessions found.");
    dataSnapshot.docs.forEach((experiment, idx) => console.log(`\t${idx}: ${experiment.id}`));
    console.log();

    // TODO 172: Convert to new regex check for ID?
    if (isNaN(sessionNumber) || sessionNumber > dataSnapshot.size - 1) {
      console.log("Invalid session number, retrieving latest session");
      return dataSnapshot.docs[dataSnapshot.size - 1];
    } else return dataSnapshot.docs[sessionNumber];
  })
  // Query Firestore for the experiment's trials (sorted by trial_index)
  .then((experimentDoc) => {
    console.log(`Reading document data for ${experimentDoc.id}`);

    // TODO 172: Prevent nested promises (async/await with cjs)
    const trialsRef = db.collection(`${dataRef.path}/${experimentDoc.id}/trials`);
    trialsRef
      .orderBy("trial_index")
      .get()
      // Get the data out of each trial document
      .then((trialsSnapshot) => trialsSnapshot.docs.map((trial) => trial.data()))
      // Add trials to experiment object as "results" array
      .then((results) => {
        const experimentData = experimentDoc.data();
        experimentData.results = results;
        return experimentData;
      })
      // Save the session to a unique JSON file.
      .then((experimentData) => {
        const outputFile =
          `${outputRoot}/participant_responses/` +
          `${studyID}/${participantID}/${experimentDoc.id}.json`.replaceAll(":", "_");
        // TODO 172: Check for overwriting file?
        // TODO 172: More compatible file name? (replaced : with _ for ISO date)
        fs.outputJson(outputFile, experimentData, { spaces: 2 })
          .then(() => console.log("OK:", outputFile))
          .catch((error) => {
            throw new Error("Unable to write JSON file\n\n" + error.stack);
          });
      });
  });
