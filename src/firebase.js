import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

// TODO: Upgrade to modular SDK instead of compat

// Initialize Firebase and Firestore
firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId || 'no-firebase',
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId
})
const db = firebase.firestore()

// Use emulator if on localhost
// TODO: Refactor to use NODE_ENV
if (window.location.hostname === 'localhost') db.useEmulator('localhost', 8080)

const collectionName = 'participant_responses'
/**
 * Get a reference to the Firebase document at /participant_responses/{studyID}/participants/{participantID}
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @returns Firebase document reference
 */
function getParticipantRef (studyID, participantID) {
  return db
    .collection('participant_responses')
    .doc(studyID)
    .collection('participants')
    .doc(participantID)
}

/**
 * Get a reference to the Firebase document at /participant_responses/{studyID}/participants/{participantID}/data/{startDate}
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @param {string} startDate The ID of a given experiment inside the studyID and participantID
 * @returns Firebase document reference
 */
function getExperimentRef (studyID, participantID, startDate) {
  return getParticipantRef(studyID, participantID).collection('data').doc(startDate)
}

/**
 * Validate the given studyID & participantID combo
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @returns true if the given studyID & participantID combo is in Firebase, false otherwise
 */
// TODO: Reverse participantID and studyID order
async function validateParticipant (participantID, studyID) {
  try {
    // Attempting to get document will fail if path is invalid
    await getParticipantRef(studyID, participantID).get()
    return true
  } catch (error) {
    console.error('Unable to validate the experiment\n', error)
    return false
  }
}

/**
 * Initialize a new experiment in Firebase
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @param {string} startDate The ID of a given participant inside the studyID and participantID
 * @returns true if able to initialize the new experiment, false otherwise
 */
// TODO: Reverse participantID and studyID order
async function initParticipant (participantID, studyID, startDate) {
  try {
    const experiment = getExperimentRef(studyID, participantID, startDate)
    await experiment.set({
      start_time: startDate,
      app_version: window.navigator.appVersion,
      app_platform: window.navigator.platform,
      results: []
    })
    console.log('Initialized experiment:', studyID, participantID, startDate)
    return true
  } catch (error) {
    console.error('Unable to initialize the experiment:\n', error)
    return false
  }
}
// Add individual trials to db
const addToFirebase = (data) => {
  console.log('Adding trial to firebase', data)
  const participantId = data.participant_id
  const studyId = data.study_id
  const startDate = data.start_date

  // Data in firestore is nested as a single collection
  db.collection(collectionName)
    .doc(studyId)
    .collection('participants')
    .doc(participantId)
    .collection('data')
    .doc(startDate)
    .update('results', firebase.firestore.FieldValue.arrayUnion(data))
}

// Export types that exists in Firestore
export { db, collectionName, validateParticipant, initParticipant, addToFirebase }

export default firebase
