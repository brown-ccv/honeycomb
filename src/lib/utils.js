/**
 * Pauses program execution for a given amount of time
 * @param {number} ms The number of milliseconds to sleep for
 * @returns A resolved promise after ms milliseconds
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Add a random number between 0 and offset to the base number
 * @param {number} base The starting number
 * @param {number} offset The maximum addition to base
 * @returns The base number jittered by the offset
 */
export function jitter(base, offset) {
  return base + Math.floor(Math.random() * Math.floor(offset));
}

/**
 * Add a random number between 0 and 50 to the base number
 * @param {number} base The starting number
 * @returns The base number jittered by 50
 */
export function jitter50(base) {
  return jitter(base, 50);
}

/**
 * Flips a coin
 * @returns Returns true or false randomly
 */
export function randomTrue() {
  return Math.random() > 0.5;
}

/**
 * Deeply copies an object
 * @param {Object} obj The starting object
 * @returns An exact copy of obj
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format a number as a US dollar amount
 * @param {number} amount Dollar amount
 * @returns The string representation of amount in USD
 */
export function formatDollars(amount) {
  return "$" + parseFloat(amount).toFixed(2);
}

/**
 * Gets the value of a given variable from the URL search parameters
 * @param {string} queryParameter The key of the variable in the search parameters
 * @returns {string} The value of variable in the search parameters
 */
export function getSearchParam(queryParameter) {
  const params = new URLSearchParams(window.location.search);
  return params.get(queryParameter);
}

/**
 * Gets the ID of a prolific user from the URL search parameters
 * @returns
 */
export function getProlificId() {
  const prolificId = getSearchParam("PROLIFIC_PID");
  return prolificId;
}

/**
 * Interleave a value before/after every element in an array
 * @param {Array<any>} arr The original array
 * @param {any} val The value to interleave inside the array
 * @param {boolean} addBefore Whether to add val before or after each element in array
 * @returns The original array with val interleaved between every element
 */
export function interleave(arr, val, addBefore = true) {
  return [].concat(...arr.map((n) => (addBefore ? [val, n] : [n, val])));
}

/**
 * Given a millisecond value, returns how many full minutes there are (rounding down)
 *
 * @param {number} ms - millisecond
 * @returns total minutes within the provided ms
 */
export function getMinute(ms) {
  return Math.floor(ms / 1000 / 60);
}

/**
 * Given a millisecond value, calculates how many full minutes are within those milliseconds and return the left-over time as the seconds
 *
 * @param {number} ms - millisecond
 * @returns how many seconds are left after excluding the full minutes within the provided ms
 */
export function getSeconds(ms) {
  return Math.floor((ms - getMinute(ms) * 1000 * 60) / 1000);
}

/**
 * Gets the time (millisecond) in string format to display on screen
 *
 * @param {number} ms - millisecond
 * @returns return time string format, example: 00:03 (min:seconds)
 */
export function getTimeString(ms) {
  return `${getMinute(ms)}:${getSeconds(ms).toString().padStart(2, "0")}`;
}

/**
 * Retrieves the data object from the current trial in JsPsych
 * @param {JsPsych} jsPsych jsPsych instance being used to run the task
 * @returns
 */
export function getCurrentTrialData(jsPsych) {
  return jsPsych.getCurrentTrial().data;
}
/**
 * Retrieves the data object from the last trial in JsPsych
 * @param {JsPsych} jsPsych jsPsych instance being used to run the task
 * @returns {Object}
 */
export function getLastTrialData(jsPsych) {
  const dataCollection = jsPsych.data.getLastTrialData();
  return dataCollection.trials[0];
}
/**
 * Randomly retrieves a single element from an array
 * @param {JsPsych} jsPsych The jsPsych instance being used to run the task
 * @param {Array} array A given array of elements
 * @returns
 */
export function getRandomElement(jsPsych, array) {
  return jsPsych.randomization.sampleWithoutReplacement(array, 1)[0];
}
