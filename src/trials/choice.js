import { removeCursor } from "../lib/utils"

/**
 * Displays a word in a random color (blue, red, or yellow) and listens for keyboard input. If the participant presses
 * the correct key—corresponding to the font color—then the function updates the earnings for this trial accordingly.
 * The function times out after the provided number of milliseconds.
 * @param {string} word The word to display.
 * @param {string} color The font color.
 * @param {number} duration The maximum number of milliseconds the participant can take before entering a response.
 * @returns trial The jsPsych trial object.
 */
const choice = (word, color, duration) => {

  return {
    type: "html_keyboard_response",
    trial_duration: duration,
    response_ends_trial: true,
    stimulus:
      `<div class="width-100-view height-100-view">
            <p id="color-display" class="centered-h-v font-weight-bold font-size-extra-large" style="color:${color}">${word}</p>
        </div>`,
    on_start: () => {
      // The cursor is added back in showEarnings.
      removeCursor("experiment")
    },
    on_finish: (data) => {
      data.color = color
    }
  }
}

export default choice