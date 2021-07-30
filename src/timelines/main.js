import preamble from "./preamble"
import taskBlock from "./taskBlock"
import { countdown } from "@brown-ccv/behavioral-task-trials"
import { cameraStart, cameraEnd } from "../trials/camera"
import { lang, envConfig } from "../config/main"
import { showMessage } from "@brown-ccv/behavioral-task-trials"
import {
  ageCheck,
  sliderCheck,
  demographics,
  iusSurvey,
  debrief,
} from "../trials/quizTrials"

/**
 * Constructs the experiment timeline.
 * @param experimentConfig The experiment config, either the default one provided in /src/config/config.json or a
 * participant-specific override.
 * @returns {array} The experiment timeline.
 */
const tl = (experimentConfig) => {
  // Unconditional part of the timeline.
  let timeline = [
    preamble(experimentConfig),
    ageCheck,
    sliderCheck,
    countdown({ message: lang.countdown.message1 }),
    taskBlock(experimentConfig),
    demographics,
    iusSurvey,
    debrief
  ]

  // If the camera is in use, add these camera-specific trials to the timeline.
  if (envConfig.USE_CAMERA) {
    timeline.splice(1, 0, cameraStart())
    timeline.push(cameraEnd(5000))
  }

  timeline.push(showMessage(envConfig, {
    duration: 5000,
    message: lang.task.end,
  }))

  return timeline
}

export default tl