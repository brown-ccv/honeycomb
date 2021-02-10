import preamble from "./preamble";
import { showMessage, countdown } from "@brown-ccv/behavioral-task-trials";
import taskBlock from "./taskBlock";

import { lang, config } from "../config/main";
import { practiceBlock } from "../config/practice";
import { tutorialBlock } from "../config/tutorial";
import { exptBlock1, exptBlock2 } from "../config/experiment";

const primaryTimeline = [
  preamble,
  countdown({ duration: 1000, text: lang.countdown.message1, time: 3 }),
  taskBlock(practiceBlock),
  countdown({ duration: 1000, text: lang.countdown.message2, time: 3 }),
  taskBlock(exptBlock1),
  showMessage(config, {
    responseType: "html_keyboard_response",
    duration: 5000,
    message: lang.task.end,
  }),
];

const mturkTimeline = [
  preamble,
  countdown({ duration: 1000, text: lang.countdown.message1, time: 3 }),
  taskBlock(tutorialBlock),
  countdown({ duration: 1000, text: lang.countdown.message2, time: 3 }),
  taskBlock(exptBlock2),
  showMessage(config, {
    responseType: "html_keyboard_response",
    duration: 5000,
    message: lang.task.end,
  }),
];

export const tl = config.USE_MTURK ? mturkTimeline : primaryTimeline;
