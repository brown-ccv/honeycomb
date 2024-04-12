import { initJsPsych } from "jspsych";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

// Import custom styling
import "jspsych/css/jspsych.css";

const jsPsych = initJsPsych();

const trial = {
  type: htmlKeyboardResponse,
  stimulus: "Hello world!",
};

jsPsych.run([trial]);
