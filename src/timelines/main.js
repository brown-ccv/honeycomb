import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import experimentEnd from '../trials/experimentEnd'
import taskBlock from './taskBlock'

import { MTURK, lang } from '../config/main'
import { practiceBlock } from '../config/practice'
import { tutorialBlock } from '../config/tutorial'
import { exptBlock1, exptBlock2 } from '../config/experiment'


const primaryTimeline = [
        preamble,
        buildCountdown(lang.countdown.message1, 3),
        taskBlock(practiceBlock),
        buildCountdown(lang.countdown.message2, 3),
        taskBlock(exptBlock1),
        experimentEnd(5000)
        ]

const mturkTimeline = [
        preamble,
        buildCountdown(lang.countdown.message1, 3),
        taskBlock(tutorialBlock),
        buildCountdown(lang.countdown.message2, 3),
        taskBlock(exptBlock2),
        experimentEnd(3000)
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
