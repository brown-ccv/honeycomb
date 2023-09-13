// TODO: Base stimulus is forcing the container to be 100% everything
// TODO: There's a parent element from jsPsych that is doing this
// TODO: Is it possible to inject the html at that container?
// TODO: The child container is why the photodiodeGhostBox isn't sitting in the correct place
// TODO: Full vh/vw is "jspsych-content-wrapper"
const baseStimulus = (element, prompt = false, centered = false) => {
  const class_ = centered ? "center_container" : prompt ? "main-prompt" : "main";
  return `<div class=${class_}>${element}</div>`;
};

export { baseStimulus };
