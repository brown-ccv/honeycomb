import _ from "lodash";

// TODO: Manage MTurk vs PsiTurk?
// MTurk is available through JsPsych directly
// PsiTurk is what's using the JS min files

window.lodash = _.noConflict();
// TODO: This is instantiated in App.jsx. I need to get that instance here?
const PSITURK = new PsiTurk(); //eslint-disable-line no-undef

/* eslint-enable */

/**
 * Validate the login credentials of the entered study and participant
 * @param {string} studyID The ID of the Study
 * @param {string} participantID The ID of the Participant logging in
 * @returns {boolean}
 */
// TODO: Can be deleted?
export function validate_login(studyID, participantID) {
  console.log("login", studyID, participantID);
  return true;
}

/**
 * Function to execute every time data is stored using the jsPsych.data.write method.
 * All plugins use this method to save data (via a call to jsPsych.finishTrial, so this function
 * runs every time a plugin stores new data.
 * @param {object} data The JsPsych data object
 * @returns
 */
export function on_data_update(data) {
  PSITURK.recordTrialData(data);
  return;
}

/**
 *  Saves a CSV or JSON file to the computer running the experiment
 * ! This method is not valid for "home" use as the file will be downloaded on the Participant's computer
 * @param {object} data The JsPsych data object
 */
// TODO: format param takes "csv" or "json"
export function on_finish(data) {
  console.log("Experiment finished: ", data);
  const completePsiturk = async () => {
    PSITURK.saveData({
      success: () => PSITURK.completeHIT(),
      error: (e) => console.error("Unable to finish experiment", e),
    });
  };
  completePsiturk();
  return;
}