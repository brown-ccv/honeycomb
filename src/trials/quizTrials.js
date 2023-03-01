import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import surveyMultiselect from '@jspsych/plugin-survey-multi-select'
import { LANGUAGE, envConfig } from "../config/main";
import {
  survey,
  slider,
  multiSurvey,
  showMessage,
} from "@brown-ccv/behavioral-task-trials";

// Age Check
const ask = LANGUAGE.quiz.ask.age;
const res = LANGUAGE.quiz.answer.age;
const stmAge = `<div class='instructions'><h1>${ask}<br><b>${res}</b></div>`;

const ageCheck = survey({ stimulus: stmAge });

// Slider Check
const stmSl = LANGUAGE.quiz.direction.slider.right;

const sliderCheck = slider(stmSl);

const abstain = `${LANGUAGE.quiz.answer.abstain}`; // give people choice to abstain
// Survey page headers
const surveyPreamble1 = LANGUAGE.quiz.prompt.preamble.survey_1;
const surveyPreamble2 = LANGUAGE.quiz.prompt.ius.preamble;

// Intolerance of Uncertainty (IUS) Scale
const iusOptions = {
  options: [
    `${LANGUAGE.quiz.answer.ius.not}`,
    `${LANGUAGE.quiz.answer.ius.little}`,
    `${LANGUAGE.quiz.answer.ius.somewhat}`,
    `${LANGUAGE.quiz.answer.ius.very}`,
    `${LANGUAGE.quiz.answer.ius.entirely}`,
    abstain,
  ],
};

const iusPrompts = [
  `${LANGUAGE.quiz.prompt.ius.upset}`,
  `${LANGUAGE.quiz.prompt.ius.frustration}`,
  `${LANGUAGE.quiz.prompt.ius.full_life}`,
  `${LANGUAGE.quiz.prompt.ius.surprise_avoid}`,
  `${LANGUAGE.quiz.prompt.ius.unforeseen_spoil}`,
  `${LANGUAGE.quiz.prompt.ius.uncertainty_paralysis}`,
  `${LANGUAGE.quiz.prompt.ius.uncertainty_malfunction}`,
  `${LANGUAGE.quiz.prompt.ius.future}`,
  `${LANGUAGE.quiz.prompt.ius.surprise_intolerance}`,
  `${LANGUAGE.quiz.prompt.ius.doubt_paralysis}`,
  `${LANGUAGE.quiz.prompt.ius.organize}`,
  `${LANGUAGE.quiz.prompt.ius.escape}`,
];

const iusSurvey = multiSurvey({
  preamble: [surveyPreamble1 + surveyPreamble2],
  prompts: iusPrompts,
  ansChoices: iusOptions,
});

// Debrief Page (non-mTurk)
const debriefOptions = LANGUAGE.quiz.answer.debriefing.confirm_completion;
const debrief = showMessage(envConfig, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

// START of Demographics Questionnaires
const demographicsAge = LANGUAGE.quiz.ask.demographics_age;
const demographicsPreamble1 = LANGUAGE.quiz.prompt.preamble.demo_1;
const demographicsPreamble2 = LANGUAGE.quiz.prompt.preamble.demo_2;
const demographicsPreamble3 = LANGUAGE.quiz.prompt.preamble.demo_3;

const openAnswerQuestions = survey({
  preamble: demographicsPreamble1,
  stimulus: demographicsAge,
});

// multi_choice_questions
const demoMultiChoiceOptions = {
  ethnicity: [
    LANGUAGE.quiz.answer.demographics_ethnicity.hispanic_latino,
    LANGUAGE.quiz.answer.demographics_ethnicity.no_hispanic_latino,
  ],
  race: [
    `${LANGUAGE.quiz.answer.demographics_race.asian}`,
    `${LANGUAGE.quiz.answer.demographics_race.african_american}`,
    `${LANGUAGE.quiz.answer.demographics_race.caucasian}`,
    `${LANGUAGE.quiz.answer.demographics_race.native_american_alaskan}`,
    `${LANGUAGE.quiz.answer.demographics_race.native_hawaiian_pacific_islander}`,
    `${LANGUAGE.quiz.answer.demographics_race.other}`,
  ],
  yesNo: [
    LANGUAGE.quiz.answer.demographics_binary.yes,
    LANGUAGE.quiz.answer.demographics_binary.no,
  ],
  gender: [
    LANGUAGE.quiz.answer.demographics_gender.female,
    LANGUAGE.quiz.answer.demographics_gender.male,
    LANGUAGE.quiz.answer.demographics_gender.other,
  ],
};

const demoMultiChoicePrompts = [
  `${LANGUAGE.quiz.ask.demographics_ethnicity}`,
  `${LANGUAGE.quiz.ask.demographics_race}`,
  `${LANGUAGE.quiz.ask.demographics_english}`,
  `${LANGUAGE.quiz.ask.demographics_gender}`,
];

const multiChoiceQuestions = multiSurvey({
  preamble: demographicsPreamble2,
  prompts: demoMultiChoicePrompts,
  ansChoices: demoMultiChoiceOptions,
});

// multi_select_questions
const diagnosesQuestions = LANGUAGE.quiz.ask.diagnoses;

const diagnosesOptions = {
  diagnoses: [
    LANGUAGE.quiz.answer.demographics_diagnoses.no,
    LANGUAGE.quiz.answer.demographics_diagnoses.parkinsons,
    LANGUAGE.quiz.answer.demographics_diagnoses.schizophrenia,
    LANGUAGE.quiz.answer.demographics_diagnoses.ocd,
    LANGUAGE.quiz.answer.demographics_diagnoses.depression,
  ],
};

const multiSelectQuestions = multiSurvey({
  responseType: surveyMultiselect,
  preamble: demographicsPreamble3,
  prompts: [diagnosesQuestions],
  ansChoices: diagnosesOptions,
});

// demographics
const demographics = {
  timeline: [
    openAnswerQuestions, // age, sex
    multiChoiceQuestions, // ethnicity, race, english_fluency
    multiSelectQuestions, // diagnoses
  ],
};

export { ageCheck, sliderCheck, iusSurvey, debrief, demographics };
