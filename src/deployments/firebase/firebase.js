import { getExperimentRef, getParticipantRef } from "../../firebase";

/**
 * Validate the given studyID & participantID combo
 * @param {string} studyID The ID of the Study
 * @param {string} participantID The ID of the Participant logging in
 * @returns {boolean} true if the given studyID & participantID combo is in Firebase, false otherwise
 */
export async function validate_login(studyID, participantID) {
  try {
    // Note that .get() will fail on an invalid path
    await getParticipantRef(studyID, participantID).get();
    return true;
  } catch (error) {
    console.error("Unable to validate the experiment:\n", error);
    return false;
  }
}

/**
 * Adds a JsPsych trial to Firebase.
 * Each trial is its own document in the "trials" subcollection
 * @param {any} data The JsPsych data object from a single trial
 */
export async function on_data_update(data) {
  try {
    const experiment = getExperimentRef(data.studyID, data.participantID, data.startDate);
    await experiment.collection("trials").add(data);
  } catch (error) {
    console.error("Unable to add trial:\n", error);
  }
  return;
}
