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

const tl = (experimentConfig) => {
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