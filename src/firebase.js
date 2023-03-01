import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


// Set collection name
// TODO: Delete in favor of RESPONSE_COLLECTION_NAME
const collectionName = "participant_responses";

/* Useful variables for reusing the Firestore database path. */
// TODO: These can be used elsewhere
const REGISTERED_COLLECTION_NAME = "registered_studies"
const RESPONSE_COLLECTION_NAME = "participant_responses";

// Configuration object used to initialize Firebase
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId || "no-firebase",
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

// Initialize the Firebase app and get an instance of Firestore
const app = firebase.initializeApp(config);
const db = app.firestore();

// Use FirebaseFirestore emulator if on localhost
// TODO: Use a DEV environment variable instead of checking URL
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", 8080);
}

/**
 * Saves the experiment config object to Firestore.
 * Configuration is saved at /participant_responses/<study ID>/participants/<participant ID>/<start date>
 * @param participantID The participant ID under which to save the config.
 * @param studyID The study ID under which to save the config.
 * @param startDate The start date of this run of the task - used as a unique ID
 * @param config The experiment config being used in this run of the task.
 */
const addConfigToFirebase = (participantID, studyID, startDate, config) => {
  console.log("Adding config to Firebase")
  db.collection(RESPONSE_COLLECTION_NAME)
    .doc(studyID)
    .collection("participants")
    .doc(participantID)
    .collection("data")
    .doc(startDate)
    .update({ config: config });
};

/**
 * Handles fetching the experiment config for a study and a particular participant from Firestore.
 * @param studyID The study ID to search under.
 * @param docName The name of the config document, either "default" or the participant ID.
 * @returns {Promise<config>} A Promise containing the config object, if it exists. Returns null otherwise.
 */
const handleFirestoreConfigFetch = (studyID, docName) => {
  return db
    .collection(REGISTERED_COLLECTION_NAME)
    .doc(studyID)
    .collection("config")
    .doc(docName)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(`Doc ${docName} exists`)
        return JSON.parse(doc.data().config);
      } else {
        console.log(`Document ${docName} does not exist`);
        return false;
      }
    })
    .catch((error) => console.log("Error in getting config:", error));
};

/**
 * Gets the config object for the logged-in participant, or uses the default for the study.
 * @param {string} studyID The study ID specified at login.
 * @param {string} participantID The logged in participant ID.
 */
const getFirestoreConfig = async (studyID, participantID) => {
  // Fetch both the default and participant-specific config.
  const pConfig = await handleFirestoreConfigFetch(studyID, participantID);
  const defaultConfig = await handleFirestoreConfigFetch(studyID, "default");

  // Check if participant-specific config exists. 
  // If it doesn't, fall back to default
  // Returns false if neither exists - indicates a problem with the task setup in Firestore.
  // TODO: Return null on fallback, not false
  if (pConfig) {
    console.log("Participant config:", pConfig)
    return pConfig;
  } else if (defaultConfig) {
    console.log("Using default config")
    return defaultConfig;
  } else {
    return false;
  }
};

/**
 * Both initializes a participant's data in Firestore and validates login. If the Firebase rules prohibit saving the
 * participant's data, then we know they did not enter a valid participant and study ID.
 * @param participantId The new participant's ID.
 * @param studyId The study ID.
 * @param startDate The start date of this run of the task.
 * @returns {Promise<boolean>} Whether or not the login is valid.
 */
const initParticipant = (participantId, studyId, startDate) => {
  return db.collection(RESPONSE_COLLECTION_NAME)
    .doc(studyId)
    .collection('participants')
    .doc(participantId)
    .collection('data')
    .doc(startDate)
    .set({ start_time: startDate, app_version: window.navigator.appVersion, app_platform: window.navigator.platform, results: [] })
    .then(() => {
      return true
    })
    .catch((error) => {
      console.error("Error initializing participant: ", error)
      return false
    });
};

/**
 * Saves data for an individual trial to Firestore.
 * @param data An object that must contain the participant ID, the study ID, and the start date.
 */
const addToFirebase = (data) => {
  console.log(data)
  const participantId = data.participant_id;
  const studyId = data.study_id;
  const startDate = data.start_date

  db.collection(RESPONSE_COLLECTION_NAME)
    .doc(studyId)
    .collection('participants')
    .doc(participantId)
    .collection('data')
    .doc(startDate)
    .update('results', firebase.firestore.FieldValue.arrayUnion(data))
};

// Export types that exists in Firestore
export {
  db,
  collectionName,
  REGISTERED_COLLECTION_NAME,
  RESPONSE_COLLECTION_NAME,
  initParticipant,
  addToFirebase,
  getFirestoreConfig,
  addConfigToFirebase
};

export default firebase;