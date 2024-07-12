import { initializeApp } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

// Initialize Firebase and Firestore
const APP = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID ?? "no-firebase",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
});
export const DB = getFirestore(APP);

// Use emulator if on localhost
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(DB, "127.0.0.1", 8080);
}

// Get a reference to the Firebase document at
// "/participant_responses/{studyID}/participants/{participantID}"
async function getParticipantRef(studyID, participantID) {
  return doc(DB, `participant_responses/${studyID}/participants/${participantID}`);
}

// Get a reference to the Firebase document at
// "/participant_responses/{studyID}/participants/{participantID}/data/{startDate}"
export function getExperimentRef(studyID, participantID, startDate) {
  return doc(
    DB,
    `participant_responses/${studyID}/participants/${participantID}/data/${startDate}`
  );
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
    await getParticipantRef(studyID, participantID);
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
      // TODO @brown-ccv #394: Don't handle any of this here? Let everything be done in jsPsych

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
    await addDoc(collection(DB, `${experiment.path}/trials`), {
      data,
    });
  } catch (error) {
    console.error("Unable to add trial:\n", error);
  }
}
