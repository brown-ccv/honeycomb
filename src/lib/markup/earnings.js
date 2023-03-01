import { formatDollars } from "../utils";

/**
 * Displays the earnings for a trial.
 * @param earnings The amount of dollars to display.
 * @param slow Whether or not the participant responded too slowly.
 * @returns {string} The HTML to display for the earnings.
 */
const earningsDisplay = (earnings, slow = false) => {
  // Font is red or green if the earnings are negative or positive, respectively
  const class_ = earnings >= 0 ? "success" : "danger";
  return `<div class='center_container'>
    ${slow ? '<h1>Too slow!</h1>' : ''}
    <h1 class='text-${class_}'>
      ${formatDollars(earnings)}
    </h1>
    </div>`;
};

export { earningsDisplay };
