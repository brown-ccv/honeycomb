// TODO @brown-ccv #183: Upgrade to modular SDK instead of compat
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Initialize Firebase and Firestore
firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId ?? "no-firebase",
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
});
export const db = firebase.firestore();

// Use emulator if on localhost
if (window.location.hostname === "localhost") db.useEmulator("localhost", 8080);

// Get a reference to the Firebase document at
// "/participant_responses/{studyID}/participants/{participantID}"
function getParticipantRef(studyID, participantID) {
  return db.doc(`participant_responses/${studyID}/participants/${participantID}`);
}

// Get a reference to the Firebase document at
// "/participant_responses/{studyID}/participants/{participantID}/data/{startDate}"
export function getExperimentRef(studyID, participantID, startDate) {
  return db.doc(`${getParticipantRef(studyID, participantID).path}/data/${startDate}`);
}

/**
 * Validate the given studyID & participantID combo
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @returns true if the given studyID & participantID combo is in Firebase, false otherwise
 */
export async function validateParticipant(studyID, participantID) {
  try {
    // .get() will fail on an invalid path
    await getParticipantRef(studyID, participantID).get();
    return true;
  } catch (error) {
    console.error("Unable to validate the experiment:\n", error);
    return false;
  }
}

/**
 * Initialize a new experiment in Firebase
 * Each experiment is its own document in the "data" subcollection. startDate is used as the ID
 * @param {string} studyID The ID of a given study in Firebase
 * @param {string} participantID The ID of a given participant inside the studyID
 * @param {string} startDate The ID of a given participant inside the studyID and participantID
 * @returns true if able to initialize the new experiment, false otherwise
 */
export async function initParticipant(studyID, participantID, startDate) {
  try {
    const experiment = getExperimentRef(studyID, participantID, startDate);
    await experiment.set({
      // TODO @brown-ccv #394: Write GIT SHA here
      // TODO @brown-ccv #394: Store participantID and studyID here, not on each trial
      start_time: startDate,
      // TODO @brown-ccv #394: app_version and app_platform are deprecated
      app_version: window.navigator.appVersion,
      app_platform: window.navigator.platform,
    });
    console.log("Initialized experiment:", studyID, participantID, startDate);
    return true;
  } catch (error) {
    console.error("Unable to initialize the experiment:\n", error);
    return false;
  }
}

/**
 * Adds a JsPsych trial to Firebase.
 * Each trial is its own document in the "trials" subcollection
 * @param {any} data The JsPsych data object from a single trial
 */
export async function addToFirebase(data) {
  const studyID = data.study_id;
  const participantID = data.participant_id;
  const startDate = data.start_date;

  try {
    const experiment = getExperimentRef(studyID, participantID, startDate);
    await experiment.collection("trials").add(data);
  } catch (error) {
    console.error("Unable to add trial:\n", error);
  }
}
