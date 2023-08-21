/**
 * Validate the login credentials of the entered study and participant
 * @throws Whenever this deployment is used
 */
export function validate_login() {
  throw new Error("A valid deployment was not provided. validate_login is undefined");
}

/**
 * Function to execute every time data is stored using the jsPsych.data.write method.
 * All plugins use this method to save data (via a call to jsPsych.finishTrial), so this function
 * runs every time a plugin stores new data.
 * @throws Whenever this deployment is used
 */
export function on_data_update() {
  throw new Error("A valid deployment was not provided. on_data_update is undefined");
}

/**
 * Saves a CSV or JSON file to the computer running the experiment
 * @throws Whenever this deployment is used
 */
// TODO: format param takes "csv" or "json"
export function on_finish() {
  throw new Error("A valid deployment was not provided. on_finish is undefined");
}
