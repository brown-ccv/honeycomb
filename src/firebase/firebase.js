import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import FIREBASE_CONFIG from "./firebase.config.json";

// TODO 183: Upgrade to modular SDK instead of compat

// Initialize Firebase and Firestore
firebase.initializeApp(FIREBASE_CONFIG);
export const db = firebase.firestore();

// Use emulator if on localhost
// TODO 173: Refactor to use NODE_ENV
if (window.location.hostname === "localhost") db.useEmulator("localhost", 8080);

// Get a reference to the Firebase document at
// "/participant_responses/{studyID}/participants/{participantID}"
export function getParticipantRef(studyID, participantID) {
  return db.doc(`participant_responses/${studyID}/participants/${participantID}`);
}

/**
 * Get a reference to the Firebase document at
 * "/participant_responses/{studyID}/participants/{participantID}/data/{startDate}"
 * @param {string} studyID
 * @param {string} participantID
 * @param {Date} startDate The starting date-time of the experiment
 * @returns {DocumentReference} A reference to the document in Firestore
 */
export function getExperimentRef(studyID, participantID, startDate) {
  return db.doc(`${getParticipantRef(studyID, participantID).path}/data/${startDate}`);
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
      start_time: startDate,
      // TODO 173: app_version and app_platform are deprecated
      // TODO: Pass taskVersion into this function from <Experiment />
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
