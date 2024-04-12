// The Basics: Hello World (option 3)
// https://www.jspsych.org/7.3/tutorials/hello-world/#option-3-using-npm

// Import the code we need
import { initJsPsych } from "jspsych";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import "jspsych/css/jspsych.css"; // This is custom styling

// Initialize the jsPsych instance
// https://www.jspsych.org/7.3/reference/jspsych/#initjspsych
const jsPsych = initJsPsych();

// Create a trial object of type htmlKeyboardResponse
// https://www.jspsych.org/7.3/plugins/html-keyboard-response/
const trial = {
  type: htmlKeyboardResponse,
  stimulus: "Hello world!",
};

// Run the jsPsych experiment
jsPsych.run([trial]);
