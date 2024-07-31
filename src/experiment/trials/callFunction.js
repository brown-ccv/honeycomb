import callFunction from "@jspsych/plugin-call-function";

/**
 * Trial to execute the callback function passed in
 *
 * @param {function} func callback function to execute
 * @returns JS object as a trial
 */
export function buildCallFunctionTrial(func) {
  return {
    type: callFunction,
    func: func,
  };
}
