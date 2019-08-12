import { ageCheck, sliderCheck, quiz, quizCheck } from '../trials/quizTrials'

import buildCountdown from '../trials/countdown'
import beadStart from '../trials/beadStart'
import showBeads from '../trials/showBeads'
import action from '../trials/action'
import preamble from './preamble'
import experimentEnd from '../trials/experimentEnd'
import beadsBlock from './beadsBlock'
import userId from '../trials/userId'

import { lang, MTURK } from '../config/main'
import { exptBlock1, exptBlock2 } from '../config/experiment'



const primaryTimeline = [
        userId(exptBlock1),
        preamble,
        beadsBlock(exptBlock1)
        ]

const mturkTimeline = [
        userId(exptBlock1),
        preamble,
        beadsBlock(exptBlock1)]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
