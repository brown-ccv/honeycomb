// TODO: This should be a "component"? Some constant?
function baseStimulus(element, prompt = false, centered = false) {
  const class_ = centered ? 'center_container' : prompt ? 'main-prompt' : 'main';
  return `<div class=${class_}>${element}</div>`;
}

export { baseStimulus };
