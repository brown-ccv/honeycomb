// TODO 162: This should be a "component"? Some constant?
// TODO 162: Have a markup.js file, consolidate these other files
// TODO: behavior-task-trials exports these as the trial option?
export function baseStimulus(element, prompt = false, centered = false) {
  const class_ = centered ? 'center_container' : prompt ? 'main-prompt' : 'main';
  return `<div class=${class_}>${element}</div>`;
}
