import { div } from "./tags";

/**
 * Base container for stimuli that takes up 100% of the height and width of the viewport
 * @param {string} children The children of the HTML tag
 * @param {boolean} prompt Whether or not the children are a prompt
 * @param {boolean} centered Whether or not the children should be centered on the container
 * @returns
 */
function baseStimulus(children, prompt = false, centered = false) {
  return div(children, { class: centered ? "center_container" : prompt ? "main-prompt" : "main" });
}

// TODO #338: Base stimulus is forcing the container to be 100% everything
// TODO #338: There's a parent element from jsPsych that is doing this
// TODO #338: Is it possible to inject the html at that container?
// TODO #338: The child container is why the photodiodeGhostBox isn't sitting in the correct place
// TODO #338: Full vh/vw is "jspsych-content-wrapper"

export { baseStimulus };
