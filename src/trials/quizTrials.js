import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import surveyMultiselect from '@jspsych/plugin-survey-multi-select'
import { lang, config } from "../config/main";
import {
  survey,
  slider,
  multiSurvey,
  showMessage,
} from "@brown-ccv/behavioral-task-trials";

// Age Check
const ask = lang.quiz.ask.age;
const res = lang.quiz.answer.age;
const stmAge = `<div class='instructions'><h1>${ask}<br><b>${res}</b></div>`;

const ageCheck = survey({ stimulus: stmAge });

// Slider Check
const stmSl = lang.quiz.direction.slider.right;

const sliderCheck = slider(stmSl);

const abstain = `${lang.quiz.answer.abstain}`; // give people choice to abstain
// Survey page headers
const surveyPreamble1 = lang.quiz.prompt.preamble.survey_1;
const surveyPreamble2 = lang.quiz.prompt.ius.preamble;

// Intolerance of Uncertainty (IUS) Scale
const iusOptions = {
  options: [
    `${lang.quiz.answer.ius.not}`,
    `${lang.quiz.answer.ius.little}`,
    `${lang.quiz.answer.ius.somewhat}`,
    `${lang.quiz.answer.ius.very}`,
    `${lang.quiz.answer.ius.entirely}`,
    abstain,
  ],
};

const iusPrompts = [
  `${lang.quiz.prompt.ius.upset}`,
  `${lang.quiz.prompt.ius.frustration}`,
  `${lang.quiz.prompt.ius.full_life}`,
  `${lang.quiz.prompt.ius.surprise_avoid}`,
  `${lang.quiz.prompt.ius.unforeseen_spoil}`,
  `${lang.quiz.prompt.ius.uncertainty_paralysis}`,
  `${lang.quiz.prompt.ius.uncertainty_malfunction}`,
  `${lang.quiz.prompt.ius.future}`,
  `${lang.quiz.prompt.ius.surprise_intolerance}`,
  `${lang.quiz.prompt.ius.doubt_paralysis}`,
  `${lang.quiz.prompt.ius.organize}`,
  `${lang.quiz.prompt.ius.escape}`,
];

const iusSurvey = multiSurvey({
  preamble: [surveyPreamble1 + surveyPreamble2],
  prompts: iusPrompts,
  ansChoices: iusOptions,
});

// Debrief Page (non-mTurk)
const debriefOptions = lang.quiz.answer.debriefing.confirm_completion;
const debrief = showMessage(config, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

// START of Demographics Questionnaires
const demographicsAge = lang.quiz.ask.demographics_age;
const demographicsPreamble1 = lang.quiz.prompt.preamble.demo_1;
const demographicsPreamble2 = lang.quiz.prompt.preamble.demo_2;
const demographicsPreamble3 = lang.quiz.prompt.preamble.demo_3;

const openAnswerQuestions = survey({
  preamble: demographicsPreamble1,
  stimulus: demographicsAge,
});

// multi_choice_questions
const demoMultiChoiceOptions = {
  ethnicity: [
    lang.quiz.answer.demographics_ethnicity.hispanic_latino,
    lang.quiz.answer.demographics_ethnicity.no_hispanic_latino,
  ],
  race: [
    `${lang.quiz.answer.demographics_race.asian}`,
    `${lang.quiz.answer.demographics_race.african_american}`,
    `${lang.quiz.answer.demographics_race.caucasian}`,
    `${lang.quiz.answer.demographics_race.native_american_alaskan}`,
    `${lang.quiz.answer.demographics_race.native_hawaiian_pacific_islander}`,
    `${lang.quiz.answer.demographics_race.other}`,
  ],
  yesNo: [
    lang.quiz.answer.demographics_binary.yes,
    lang.quiz.answer.demographics_binary.no,
  ],
  gender: [
    lang.quiz.answer.demographics_gender.female,
    lang.quiz.answer.demographics_gender.male,
    lang.quiz.answer.demographics_gender.other,
  ],
};

const demoMultiChoicePrompts = [
  `${lang.quiz.ask.demographics_ethnicity}`,
  `${lang.quiz.ask.demographics_race}`,
  `${lang.quiz.ask.demographics_english}`,
  `${lang.quiz.ask.demographics_gender}`,
];

const multiChoiceQuestions = multiSurvey({
  preamble: demographicsPreamble2,
  prompts: demoMultiChoicePrompts,
  ansChoices: demoMultiChoiceOptions,
});

// multi_select_questions
const diagnosesQuestions = lang.quiz.ask.diagnoses;

const diagnosesOptions = {
  diagnoses: [
    lang.quiz.answer.demographics_diagnoses.no,
    lang.quiz.answer.demographics_diagnoses.parkinsons,
    lang.quiz.answer.demographics_diagnoses.schizophrenia,
    lang.quiz.answer.demographics_diagnoses.ocd,
    lang.quiz.answer.demographics_diagnoses.depression,
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
