import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

// TODO: Can store variables for the nested pieces of a record https://firebase.google.com/docs/firestore/data-model#references

// Initialize Firebase and Firestore
const db = firebase
  .initializeApp({
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId || 'no-firebase',
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
  })
  .firestore()

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

// Attempts to retrieve the data in /{collectionName}/{study_id}/participants/{participant_id}
// Will return false if participant isn't valid
// const validateParticipant = async (participantId, studyId) => {
//   return await db
//     .collection(collectionName)
//     .doc(studyId)
//     .collection('participants')
//     .doc(participantId)
//     .then(() => true)
//     .catch((error) => {
//       console.error(error);
//       return false;
//     });
// };
// TODO: Reverse participantID and studyID
/**
 * Validate the given studyID & participantID combo
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @returns true if the given studyID & participantID combo is in Firebase, false otherwise
 */
async function validateParticipant (participantID, studyID) {
  try {
    await getParticipantRef(studyID, participantID)
    console.log('Validated participant', studyID, participantID)
    return true
  } catch (error) {
    console.error('Unable to validate the experiment', error)
    return false
  }
}

// const initParticipant = async (participantId, studyId, startDate) => {
//   try {
//     await db
//       .collection(collectionName)
//       .doc(studyId)
//       .collection('participants')
//       .doc(participantId)
//       .collection('data')
//       .doc(startDate)
//       .set({
//         start_time: startDate,
//         app_version: window.navigator.appVersion,
//         app_platform: window.navigator.platform,
//         results: [],
//       });
//     return true;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };
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
    console.log('Initialized experiment', studyID, participantID)
    return true
  } catch (error) {
    console.error('Unable to initialize the experiment', error)
    return false
  }
}

// Add individual trials to db

// const addToFirebase = (data) => {
//   console.log('Adding trial to firebase', data)
//   const participantID = data.participant_id
//   const studyID = data.study_id
//   const startDate = data.start_date

//   // Data in firestore is nested as a single collection
//   db.collection(collectionName)
//     .doc(studyID)
//     .collection('participants')
//     .doc(participantID)
//     .collection('data')
//     .doc(startDate)
//     .update('results', firebase.firestore.FieldValue.arrayUnion(data))
// }

// TODO: Reverse participantID and studyID
/**
 *
 * @param {*} data The JsPsych data object
 */
async function addToFirebase (data) {
  console.log('Adding trial to firebase', data)
  const participantID = data.participant_id
  const studyID = data.study_id
  const startDate = data.start_date

  try {
    // Data in firestore is nested as a single collection
    const experiment = getExperimentRef(studyID, participantID, startDate)
    await experiment.update('results', firebase.firestore.FieldValue.arrayUnion(data))
  } catch (error) {
    console.error('Unable to add trial:', error)
  }
}

// Export types that exists in Firestore
export { db, validateParticipant, initParticipant, addToFirebase }

export default firebase
