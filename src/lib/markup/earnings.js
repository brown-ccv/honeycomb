import { formatDollars } from "../utils"

/**
 * Displays the earnings for a trial.
 * @param earnings The amount of dollars to display.
 * @param slow Whether or not the participant responded too slowly.
 * @returns {string} The HTML to display for the earnings.
 */
const earningsDisplay = (earnings, slow = false) => {
  // If earnings are positive or 0, color the font green, otherwise red.
  const bclass = (earnings >= 0) ? "success" : "danger"

  return (
    // Conditionally display "too slow" if the participant was too slow.
    // Color the font red or green if the earnings are negative or positive, respectively.
    `<div class='center_container'>
        <h1>${slow ? "Too slow!<br><br>" : ""}<span class='text-${bclass}'>${formatDollars(earnings)}</span></h1>
    </div>`
  )
}

export { earningsDisplay }
