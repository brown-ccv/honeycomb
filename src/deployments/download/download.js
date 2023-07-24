/**
 * Validate the login credentials of the entered study and participant
 * @param {string} studyID The ID of the Study
 * @param {string} participantID The ID of the Participant logging in
 * @returns {boolean}
 */
// TODO: Can be deleted?
export function validate_login(studyID, participantID) {
  console.log("download login", studyID, participantID);
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
  // TODO: ("Trial _ has ended:")
  console.log("A trial has ended:", data);
  return;
}

/**
 *  Saves a CSV or JSON file to the computer running the experiment
 * ! This method is not valid for "home" use as the file will be downloaded on the Participant's computer
 * @param {object} data The JsPsych data object
 */
// TODO: format param takes "csv" or "json"
export function on_finish(data) {
  data.localSave("csv", "honeycomb.csv");
  return;
}
