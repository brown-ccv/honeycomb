import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


// Set collection name
const collectionName = "participant_responses";

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

// Attempts to retrieve the data in /{collectionName}/{study_id}/participants/{participant_id}
// Will return false if participant isn't valid
const validateParticipant = async (participantId, studyId) => {
  return db.collection(collectionName)
    .doc(studyId)
    .collection('participants')
    .doc(participantId)
    .then(() => {
      return true
    })
    .catch((error) => {
      console.error(error)
      return false
    });
}

// Add participant data and trial data to db
const initParticipant = (participantId, studyId, startDate) => {
  // return promise with value true if participant and study id match, false otherwise
  return db.collection(collectionName)
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
      console.error(error)
      return false
    });
};

// Add individual trials to db
const addToFirebase = (data) => {
  console.log("Adding trial to firebase", data)
  const participantId = data.participant_id;
  const studyId = data.study_id;
  const startDate = data.start_date

  db.collection(collectionName)
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
  validateParticipant,
  initParticipant,
  addToFirebase
};

export default firebase;