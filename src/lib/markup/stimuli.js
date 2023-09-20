import { div } from "./tags";

// TODO: Base stimulus is forcing the container to be 100% everything
// TODO: There's a parent element from jsPsych that is doing this
// TODO: Is it possible to inject the html at that container?
// TODO: The child container is why the photodiodeGhostBox isn't sitting in the correct place
// TODO: Full vh/vw is "jspsych-content-wrapper"
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

export { baseStimulus };
