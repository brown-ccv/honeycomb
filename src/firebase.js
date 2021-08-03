import firebase from "firebase";
import 'firebase/firestore';

require("dotenv").config();

// Set collection name
const REGISTERED_COLLECTION_NAME = "registered_studies"
const RESPONSE_COLLECTION_NAME = "participant_responses";

// Firebase config
let config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId || "no-firebase",
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};


// Get a Firestore instance
var db = firebase.initializeApp(config).firestore();

// Use emulator if on localhost
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", 8080);
}

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
 * Gets the config object for the logged-in participant, or uses the default for the study. The config object
 * is a string.
 * @param {string} studyID The study ID specified at login.
 * @param {string} participantID The logged in participant ID.
 */
const getFirestoreConfig = async (studyID, participantID) => {
  const pConfig = await handleFirestoreConfigFetch(studyID, participantID);
  const defaultConfig = await handleFirestoreConfigFetch(studyID, "default");
  if (pConfig) {
    console.log("Participant config:", pConfig)
    return pConfig;
  } else if (defaultConfig) {
    return defaultConfig;
  } else {
    return false;
  }
};

// Add participant data and trial data to db
const initParticipant = (participantId, studyId, startDate) => {
  // return promise with value true if participant and study id match, false otherwise
    return db.collection(RESPONSE_COLLECTION_NAME)
    .doc(studyId)
    .collection('participants')
    .doc(participantId)
    .collection('data')
    .doc(startDate)
    .set({ start_time: startDate, app_version: window.navigator.appVersion, app_platform: window.navigator.platform, results: []})
    .then(()=>{
      return true
    })
    .catch(() => {
      return false
    });
};

// Add inidividual trials to db
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
  initParticipant,
  addToFirebase,
  getFirestoreConfig,
  addConfigToFirebase
};

export default firebase;