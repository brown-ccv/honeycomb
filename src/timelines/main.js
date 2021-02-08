import preamble from './preamble'
import {showMessage, countdown} from '@brown-ccv/behavioral-task-trials'
import taskBlock from './taskBlock'

import { lang, config } from '../config/main'
import { practiceBlock } from '../config/practice'
import { tutorialBlock } from '../config/tutorial'
import { exptBlock1, exptBlock2 } from '../config/experiment'

const primaryTimeline = [
        preamble,
        countdown(1000, lang.countdown.message1, 3),
        taskBlock(practiceBlock),
        countdown(1000, lang.countdown.message2, 3),
        taskBlock(exptBlock1),
        showMessage('html_keyboard_response',5000, config,`<h1>${lang.task.end}</h1>`)
        ]

const mturkTimeline = [
        preamble,
        countdown(1000, lang.countdown.message1, 3),
        taskBlock(tutorialBlock),
        countdown(1000, lang.countdown.message2, 3),
        taskBlock(exptBlock2),
        showMessage('html_keyboard_response',5000, config,`<h1>${lang.task.end}</h1>`)
        ]

export const tl = (config.USE_MTURK) ? mturkTimeline : primaryTimeline
