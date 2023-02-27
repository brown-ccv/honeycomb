import htmlButtonResponse from '@jspsych/plugin-html-button-response'
import surveyMultiselect from '@jspsych/plugin-survey-multi-select'
import { language, envConfig } from "../config/main";
import {
  survey,
  slider,
  multiSurvey,
  showMessage,
} from "@brown-ccv/behavioral-task-trials";

// Age Check
const ask = language.quiz.ask.age;
const res = language.quiz.answer.age;
const stmAge = `<div class='instructions'><h1>${ask}<br><b>${res}</b></div>`;

const ageCheck = survey({ stimulus: stmAge });

// Slider Check
const stmSl = language.quiz.direction.slider.right;

const sliderCheck = slider(stmSl);

const abstain = `${language.quiz.answer.abstain}`; // give people choice to abstain
// Survey page headers
const surveyPreamble1 = language.quiz.prompt.preamble.survey_1;
const surveyPreamble2 = language.quiz.prompt.ius.preamble;

// Intolerance of Uncertainty (IUS) Scale
const iusOptions = {
  options: [
    `${language.quiz.answer.ius.not}`,
    `${language.quiz.answer.ius.little}`,
    `${language.quiz.answer.ius.somewhat}`,
    `${language.quiz.answer.ius.very}`,
    `${language.quiz.answer.ius.entirely}`,
    abstain,
  ],
};

const iusPrompts = [
  `${language.quiz.prompt.ius.upset}`,
  `${language.quiz.prompt.ius.frustration}`,
  `${language.quiz.prompt.ius.full_life}`,
  `${language.quiz.prompt.ius.surprise_avoid}`,
  `${language.quiz.prompt.ius.unforeseen_spoil}`,
  `${language.quiz.prompt.ius.uncertainty_paralysis}`,
  `${language.quiz.prompt.ius.uncertainty_malfunction}`,
  `${language.quiz.prompt.ius.future}`,
  `${language.quiz.prompt.ius.surprise_intolerance}`,
  `${language.quiz.prompt.ius.doubt_paralysis}`,
  `${language.quiz.prompt.ius.organize}`,
  `${language.quiz.prompt.ius.escape}`,
];

const iusSurvey = multiSurvey({
  preamble: [surveyPreamble1 + surveyPreamble2],
  prompts: iusPrompts,
  ansChoices: iusOptions,
});

// Debrief Page (non-mTurk)
const debriefOptions = language.quiz.answer.debriefing.confirm_completion;
const debrief = showMessage(envConfig, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

// START of Demographics Questionnaires
const demographicsAge = language.quiz.ask.demographics_age;
const demographicsPreamble1 = language.quiz.prompt.preamble.demo_1;
const demographicsPreamble2 = language.quiz.prompt.preamble.demo_2;
const demographicsPreamble3 = language.quiz.prompt.preamble.demo_3;

const openAnswerQuestions = survey({
  preamble: demographicsPreamble1,
  stimulus: demographicsAge,
});

// multi_choice_questions
const demoMultiChoiceOptions = {
  ethnicity: [
    language.quiz.answer.demographics_ethnicity.hispanic_latino,
    language.quiz.answer.demographics_ethnicity.no_hispanic_latino,
  ],
  race: [
    `${language.quiz.answer.demographics_race.asian}`,
    `${language.quiz.answer.demographics_race.african_american}`,
    `${language.quiz.answer.demographics_race.caucasian}`,
    `${language.quiz.answer.demographics_race.native_american_alaskan}`,
    `${language.quiz.answer.demographics_race.native_hawaiian_pacific_islander}`,
    `${language.quiz.answer.demographics_race.other}`,
  ],
  yesNo: [
    language.quiz.answer.demographics_binary.yes,
    language.quiz.answer.demographics_binary.no,
  ],
  gender: [
    language.quiz.answer.demographics_gender.female,
    language.quiz.answer.demographics_gender.male,
    language.quiz.answer.demographics_gender.other,
  ],
};

const demoMultiChoicePrompts = [
  `${language.quiz.ask.demographics_ethnicity}`,
  `${language.quiz.ask.demographics_race}`,
  `${language.quiz.ask.demographics_english}`,
  `${language.quiz.ask.demographics_gender}`,
];

const multiChoiceQuestions = multiSurvey({
  preamble: demographicsPreamble2,
  prompts: demoMultiChoicePrompts,
  ansChoices: demoMultiChoiceOptions,
});

// multi_select_questions
const diagnosesQuestions = language.quiz.ask.diagnoses;

const diagnosesOptions = {
  diagnoses: [
    language.quiz.answer.demographics_diagnoses.no,
    language.quiz.answer.demographics_diagnoses.parkinsons,
    language.quiz.answer.demographics_diagnoses.schizophrenia,
    language.quiz.answer.demographics_diagnoses.ocd,
    language.quiz.answer.demographics_diagnoses.depression,
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
