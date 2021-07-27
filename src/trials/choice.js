import { removeCursor } from "../lib/utils"

/**
 * Displays a word in a random color (blue, red, or yellow) and listens for keyboard input. If the participant presses
 * the correct key—corresponding to the font color—then the function updates the earnings for this trial accordingly.
 * The function times out after the provided number of milliseconds.
 * @param {string} word The word to display.
 * @param {string} color The font color.
 * @returns trial The jsPsych trial object.
 */
const choice = (word, color) => {

  return {
    // A type of trial that calls a function rather than display a stimulus.
    type: "html_keyboard_response",
    // Allows the trial to be manually ended with the done() function.
    response_ends_trial: true,
    stimulus:
      `<div class="width-100-view height-100-view">
            <p id="color-display" class="centered-h-v font-weight-bold font-size-large" style="color:${color}">${word}</p>
        </div>`,
    on_start: () => {
      removeCursor("experiment")
    },
    on_finish: (data) => {
      data.color = color
    }
  }
}

export default choice