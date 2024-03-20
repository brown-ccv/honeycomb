import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";

// TODO @brown-ccv #401: Remove "USE_VOLUME" environment variable
// TODO @brown-ccv #402: Rename beepTrial
export const beepTrial = {
  type: audioKeyboardResponse,
  stimulus: "assets/audio/beep.mp3",
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
};
