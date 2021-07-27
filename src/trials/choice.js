import { removeCursor } from "../lib/utils"

/**
 * Displays a word in a random color (blue, red, or yellow) and listens for keyboard input. If the participant presses
 * the correct key—corresponding to the font color—then the function updates the earnings for this trial accordingly.
 * The function times out after the provided number of milliseconds.
 * @param {{earnings: number}} trialDetails An object containing the trial parameters.
 * @param {string} word The word to display.
 * @param {string} color The font color.
 * @param {number} duration The number of milliseconds to wait before timing out.
 * @returns trial The jsPsych trial object.
 */
const choice = (trialDetails, word, color, duration) => {

  // Maps colors to their corresponding key code.
  const colorKeyMappings = {
    red: "KeyR",
    blue: "KeyB",
    yellow: "KeyY"
  }

  return {
    // A type of trial that calls a function rather than display a stimulus.
    type: "call_function",
    // Allows the trial to be manually ended with the done() function.
    async: true,
    response_ends_trial: false,
    on_start: () => {
      removeCursor("experiment")
    },
    // Updates the DOM with the trial display, sets a timeout for the trial, and adds an event listener for
    // participant input.
    func: (done) => {
      // Function to run when the trial times out.
      const tooLate = () => {
        document.getElementById("color-display").style.color = "black"
        document.getElementById("color-display").innerText = "Too slow"
        setTimeout(done, 1000)
      }
      // Sets timeout for the trial.
      setTimeout(tooLate, duration)
      // Updates the DOM with the trial display word.
      document.getElementById("jspsych-content").innerHTML = `<div class="width-100-view height-100-view">
            <p id="color-display" class="centered-h-v font-weight-bold font-size-large" style="color:${color}">${word}</p>
        </div>`
      const handleKeyDown = (event) => {
          event.preventDefault()
          // Check if participant response is correct.
          if (event.code === colorKeyMappings[color]) {
            window.removeEventListener("keydown", handleKeyDown)
            trialDetails.earnings = 1
            // Display a "correct" message.
            if (document.getElementById("color-display")) {
              document.getElementById("color-display").innerText = "Correct"
              document.getElementById("color-display").style.color = "black"
            }
            setTimeout(done, 1000)
          } else {
            window.removeEventListener("keydown", handleKeyDown)
            color = "black"
            // Display an "incorrect" message.
            if (document.getElementById("color-display")) {
              document.getElementById("color-display").style = "black"
              document.getElementById("color-display").innerText = "Incorrect"
            }
            setTimeout(done, 1000)
          }
        }
      window.addEventListener("keydown", handleKeyDown)
    }
  }
}

export default choice