import callFunction from "@jspsych/plugin-call-function";

/**
 * Trial to call the provided function
 *
 * @param {function} func will call this function
 * @returns JS object as a trial
 */
export function buildCallFunctionTrial(func) {
  return {
    type: callFunction,
    func: () => {
      func;
    },
  };
}
