import preamble from "./preamble";
import { showMessage, countdown } from "@brown-ccv/behavioral-task-trials";
import taskBlock from "./taskBlock";

import { lang, config } from "../config/main";
import { practiceBlock } from "../config/practice";
import { tutorialBlock } from "../config/tutorial";
import { exptBlock1, exptBlock2 } from "../config/experiment";

const primaryTimeline = [
  preamble,
  countdown({ message: lang.countdown.message1 }),
  taskBlock(practiceBlock),
  countdown({ message: lang.countdown.message2 }),
  taskBlock(exptBlock1),
  showMessage(config, {
    duration: 5000,
    message: lang.task.end,
  }),
];

const mturkTimeline = [
  preamble,
  countdown({ message: lang.countdown.message1 }),
  taskBlock(tutorialBlock),
  countdown({ message: lang.countdown.message2 }),
  taskBlock(exptBlock2),
  showMessage(config, {
    duration: 5000,
    message: lang.task.end,
  }),
];

export const tl = config.USE_MTURK ? mturkTimeline : primaryTimeline;
