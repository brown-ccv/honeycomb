import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
// TODO: Upgrade to modular SDK instead of compat

// Initialize Firebase and Firestore
firebase
  .initializeApp({
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
if (window.location.hostname === 'localhost') db.useEmulator('localhost', 8080)

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

// TODO: Reverse participantID and studyID
/**
 * Validate the given studyID & participantID combo
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @returns true if the given studyID & participantID combo is in Firebase, false otherwise
 */
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

// TODO: Reverse participantID and studyID
/**
 * Initialize a new experiment in Firebase
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @param {string} startDate The ID of a given participant inside the studyID and participantID
 * @returns true if able to initialize the new experiment, false otherwise
 */
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

/**
 * Adds a JsPsych trial to Firebase
 * @param {*} data The JsPsych data object from a single trial
 */
async function addToFirebase (data) {
  const studyID = data.study_id
  const participantID = data.participant_id
  const startDate = data.start_date

  try {
    const experiment = getExperimentRef(studyID, participantID, startDate)
    await experiment.collection('trials').add(data)
  } catch (error) {
    console.error('Unable to add trial:\n', error)
  }
}

export { db, validateParticipant, initParticipant, addToFirebase }
export default firebase
