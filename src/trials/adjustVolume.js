import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import { LANGUAGE } from "../config/main";
import { baseStimulus } from "../lib/markup/stimuli";

/**
 * Prompt the user to adjust their machines volume
 * @returns 
 */
const adjustVolume = () => {
  const stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${LANGUAGE.instructions.adjust_volume}</h1>
    </div>
    `, true);

  return {
    type: htmlKeyboardResponse,
    stimulus: stimulus,
    prompt: LANGUAGE.prompt.continue.press,
    response_ends_trial: true,
  };
};

export default adjustVolume;
