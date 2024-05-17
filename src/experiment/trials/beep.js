import audioKeyboardResponse from "@jspsych/plugin-audio-keyboard-response";

export const beepTrial = {
  type: audioKeyboardResponse,
  stimulus: "assets/audio/beep.mp3",
  choices: "NO_KEYS",
  trial_ends_after_audio: true,
};
