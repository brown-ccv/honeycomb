// TODO 162: This should be a "component"? Some constant?
// TODO 162: Have a markup.js file, consolidate these other files
// TODO: behavior-task-trials exports these as the trial option?
/**
 * Base container for creating stimulus markup
 * @param {*} children
 * @param {*} prompt
 * @param {*} centered
 * @returns
 */
// TODO: Utility function?
export function baseStimulus(children, prompt = false, centered = false) {
  const class_ = centered ? 'center_container' : prompt ? 'main-prompt' : 'main';
  return `<div class=${class_}>${children}</div>`;
}
