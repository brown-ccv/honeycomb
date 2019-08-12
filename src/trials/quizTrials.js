import { lang, payout, tutRand, defaultBlockSettings } from '../config/main'
import { formatDollars, images, generateWaitSet } from '../lib/utils'
import { jsPsych } from 'jspsych-react'

import _ from 'lodash'

// Age Check

const ask = lang.quiz.ask.age
const res = lang.quiz.answer.age
const stmAge = `${ask}<b>${res}</b>`

const ageCheck = {
  type: "survey_text",
  questions: [
  { prompt: stmAge }
  ],
  on_finish: (data) => {
    data.uniqueId = "uniqueId" // TODO deal with unique id
    data.prompt = [stmAge]
    let answer = JSON.parse(data.responses)
    data.answer = [answer['Q0']]
  }
}

// Slider Check
const stmSl = lang.quiz.direction.slider.right

const sliderCheck = {
  type: "html_slider_response",
  stimulus: stmSl,
  on_finish: (data) => {
    data.uniqueId = "uniqueId" // TODO deal with unique id
    data.prompt = [stmSl]
    data.answer = [data.response]
  }
}

// quiz helper fucntions
const multiChoiceOptions = [
  formatDollars((-1 * defaultBlockSettings.draw_cost).toString()),
  formatDollars(payout.a.low.correct).toString(),
  formatDollars((tutRand)
  ? payout.a.high.correct
  : payout.b.high.correct).toString()
  ]

const multiChoicePrompts = [
  `${lang.quiz.ask.how_much_money_if_correct} ${lang.color.blue}`,
  `${lang.quiz.ask.how_much_money_if_correct} ${lang.color.orange}`,
  lang.quiz.ask.how_much_money_if_incorrect,
  lang.quiz.ask.how_much_draw
]

// Multiple Choice quiz. TODO images need to be updated after new taks design is completed.
// Using old images for now
const quizImages = (tutRand, payout) => {
  let imgs;

  switch ((tutRand) ? payout.a.high.correct : payout.b.high.correct) {
    case 70:
      imgs = _.filter(images, (o) => o.includes('70'))
    break;
    case 20:
      // Change 100 string when update images
      imgs = _.filter(images, (o) => o.includes('100'))
    break;
    // TODO revisit default
    default:
      imgs = _.filter(images, (o) => o.includes('70'))
  }
  // TODO move style to css
  return imgs.map((o) => `<img style="width:50vw" src="${o}">`)
}

// Quiz Trial
const quiz = {
  type: "survey_multi_choice",
  preamble: [
    quizImages(tutRand, payout)
  ],
  questions: [
    {
      prompt: multiChoicePrompts[0],
      options: multiChoiceOptions
    },{
      prompt: multiChoicePrompts[1],
      options: multiChoiceOptions
    },{
      prompt: multiChoicePrompts[2],
      options: multiChoiceOptions
    },{
      prompt: multiChoicePrompts[3],
      options: multiChoiceOptions
    }
  ],
  on_finish: function(data) {
    // TODO Unique Id
    data.uniqueId = 'uniqueId'
    data.prompt = multiChoicePrompts
    data.ans_choices = multiChoiceOptions
    var answer = JSON.parse(data.responses)
    data.answer = []
    for (var i=0; i<multiChoicePrompts.length; i++) {
      data.answer.push(answer['Q'+i])
    }
  }
}

const passedQuiz = (tutRand, payout, defaultBlockSettings, prevData) => {
  const correctAnswer = [
    formatDollars((tutRand) ? payout.a.high.correct: payout.b.high.correct).toString(),
    formatDollars(payout.a.low.correct).toString(),
    formatDollars(payout.a.low.correct).toString(),
    formatDollars((-1 * defaultBlockSettings.draw_cost).toString())
  ]

  const reducer = (accumulator, currentValue) => (
    accumulator && (currentValue === correctAnswer.shift())
  )

  const passed_quiz = (prevData.answer.reduce(reducer, true))

  // TODO revisit when MTurk is set up
  // if (passed_quiz) {
  //   psiturk.recordTrialData([prev_data])
  //   psiturk.saveData()
  // }

  return !(passed_quiz)
}

const quizCheck = {
  type: "html_keyboard_response",
  timeline: () => {
    const transition = {
      stimulus: [
      `<h2>${lang.quiz.answer.incorrect}</h2>` +
      `<p>${lang.quiz.direction.retake}</p>`
      ],
      prompt: lang.prompt.continue.press,
      data: { 'passed_quiz': false }
    }
    return generateWaitSet(transition, 1000)
  },
  conditional_function: () => {
    const prevData = jsPsych.data.getLastTrialData().values()[0]
    passedQuiz(tutRand, payout, defaultBlockSettings, prevData)
  }
}


export {
  ageCheck,
  sliderCheck,
  quiz,
  quizCheck
}
