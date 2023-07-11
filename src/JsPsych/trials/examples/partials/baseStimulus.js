/**
 * Base container for creating stimulus markup
 * @param {*} children
 * @param {*} prompt
 * @param {*} centered
 * @returns
 */
// TODO 234: Utility function?
export function baseStimulus(children, prompt = false, centered = false) {
  const class_ = centered ? 'center_container' : prompt ? 'main-prompt' : 'main';
  return `<div class=${class_}>${children}</div>`;
}
