import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { language } from "../config/main";
import { baseStimulus } from "../lib/markup/stimuli";

const adjustVolume = () => {
  const stimulus = baseStimulus(
    `
    <div class='instructions'>
    <h1>${language.instructions.adjust_volume}</h1>
    </div>
    `,
    true
  );

  return {
    type: htmlKeyboardResponse,
    stimulus,
    prompt: language.prompts.continue.press,
    response_ends_trial: true,
  };
};

export default adjustVolume;
