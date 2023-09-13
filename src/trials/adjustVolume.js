import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { language } from "../config/main";
import { baseStimulus } from "../lib/markup/stimuli";
import { div, h1 } from "../lib/markup/tags";

const adjustVolume = () => {
  const adjustVolumeMessage = h1(language.trials.adjustVolume);
  const container = div(adjustVolumeMessage, { class: "instructions" });

  const stimulus = baseStimulus(
    `
    <div class='instructions'>
    <h1>${language.trials.adjustVolume}</h1>
    </div>
    `,
    true
  );

  console.log(stimulus, baseStimulus(container, true));

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: language.prompts.continue.prompt,
    response_ends_trial: true,
  };
};

export default adjustVolume;
