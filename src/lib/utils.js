/**
 * Pauses program execution for a given amount of time
 * @param {number} ms The number of milliseconds to sleep for
 * @returns A resolved promise after ms milliseconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Add a random number between 0 and offset to the base number
 * @param {number} base The starting number
 * @param {number} offset The maximum addition to base
 * @returns The base number jittered by the offset
 */
function jitter(base, offset) {
  return base + Math.floor(Math.random() * Math.floor(offset));
}

/**
 * Add a random number between 0 and 50 to the base number
 * @param {number} base The starting number
 * @returns The base number jittered by 50
 */
function jitter50(base) {
  return jitter(base, 50);
}

/**
 * Flips a coin
 * @returns Returns true or false randomly
 */
function randomTrue() {
  return Math.random() > 0.5;
}

/**
 * Deeply copies an object
 * @param {Object} obj The starting object
 * @returns An exact copy of obj
 */
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Format a number as a US dollar amount
 * @param {number} amount Dollar amount
 * @returns The string representation of amount in USD
 */
function formatDollars(amount) {
  return "$" + parseFloat(amount).toFixed(2);
}

/**
 * Starts the JsPsych keyboard response listener
 * @param  jsPsych The jsPsych instance running the task.
 */
function startKeypressListener(jsPsych) {
  const keypressResponse = (info) => {
    const data = { key_press: info.key };
    jsPsych.finishTrial(data);
  };

  const keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressResponse,
    valid_responses: ["ALL_KEYS"],
    persist: false,
  });

  return keyboardListener;
}

/**
 * Gets the value of a given variable from the URL search parameters
 * @param {string} queryParameter The key of the variable in the search parameters
 * @returns {string} The value of variable in the search parameters
 */
function getSearchParam(queryParameter) {
  const params = new URLSearchParams(window.location.search);
  return params.get(queryParameter);
}

/**
 * Gets the ID of a prolific user from the URL search parameters
 * @returns
 */
function getProlificId() {
  const prolificId = getSearchParam("PROLIFIC_PID");
  return prolificId;
}

/**
 * Emits an audible beep
 * @param {Object} audioCodes The type/frequency of the beep
 */
function beep(audioCodes) {
  const context = new AudioContext(); // eslint-disable-line no-undef
  const o = context.createOscillator();
  const g = context.createGain();
  o.type = audioCodes.type;
  o.connect(g);
  o.frequency.setValueAtTime(audioCodes.frequency, 0);
  console.log(context.currentTime);
  g.connect(context.destination);
  o.start();
  o.stop(context.currentTime + 0.4);
}

/**
 * Interleave a value before/after every element in an array
 * @param {Array<any>} arr The original array
 * @param {any} val The value to interleave inside the array
 * @param {boolean} addBefore Whether to add val before or after each element in array
 * @returns The original array with val interleaved between every element
 */
function interleave(arr, val, addBefore = true) {
  return [].concat(...arr.map((n) => (addBefore ? [val, n] : [n, val])));
}

export {
  beep,
  deepCopy,
  formatDollars,
  getProlificId,
  getSearchParam,
  interleave,
  jitter,
  jitter50,
  randomTrue,
  sleep,
  startKeypressListener,
};
