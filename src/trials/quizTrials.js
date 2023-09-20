import { multiSurvey, showMessage, slider, survey } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyMultiselect from "@jspsych/plugin-survey-multi-select";

import { config, language } from "../config/main";
import { b, br, div, h1, p } from "../lib/markup/tags";

const QUIZ_LANGUAGE = language.trials.quiz;

// Age Check
const ask = QUIZ_LANGUAGE.ask.age;
const res = QUIZ_LANGUAGE.answer.age;

const ageMarkup = div(h1(ask) + br() + b(res), { class: "instructions" });

const ageCheck = survey({ stimulus: ageMarkup });

// Slider Check
const stmSl = QUIZ_LANGUAGE.direction.slider.right;
const sliderCheck = slider(stmSl);

const abstain = QUIZ_LANGUAGE.answer.abstain; // give people choice to abstain

// Survey page headers
const surveyPreamble1 = h1(QUIZ_LANGUAGE.prompt.preamble.survey_1);
const surveyPreamble2 =
  p(QUIZ_LANGUAGE.prompt.ius.preamble.start) +
  p(QUIZ_LANGUAGE.prompt.ius.preamble.middle) +
  p(QUIZ_LANGUAGE.prompt.ius.preamble.end);

// Intolerance of Uncertainty (IUS) Scale
const iusOptions = {
  options: [
    QUIZ_LANGUAGE.answer.ius.not,
    QUIZ_LANGUAGE.answer.ius.little,
    QUIZ_LANGUAGE.answer.ius.somewhat,
    QUIZ_LANGUAGE.answer.ius.very,
    QUIZ_LANGUAGE.answer.ius.entirely,
    abstain,
  ],
};

const iusPrompts = [
  QUIZ_LANGUAGE.prompt.ius.upset,
  QUIZ_LANGUAGE.prompt.ius.frustration,
  QUIZ_LANGUAGE.prompt.ius.full_life,
  QUIZ_LANGUAGE.prompt.ius.surprise_avoid,
  QUIZ_LANGUAGE.prompt.ius.unforeseen_spoil,
  QUIZ_LANGUAGE.prompt.ius.uncertainty_paralysis,
  QUIZ_LANGUAGE.prompt.ius.uncertainty_malfunction,
  QUIZ_LANGUAGE.prompt.ius.future,
  QUIZ_LANGUAGE.prompt.ius.surprise_intolerance,
  QUIZ_LANGUAGE.prompt.ius.doubt_paralysis,
  QUIZ_LANGUAGE.prompt.ius.organize,
  QUIZ_LANGUAGE.prompt.ius.escape,
];

const iusSurvey = multiSurvey({
  preamble: [surveyPreamble1 + surveyPreamble2],
  prompts: iusPrompts,
  ansChoices: iusOptions,
});

// Debrief Page (non-mTurk)
const debriefOptions = QUIZ_LANGUAGE.answer.debriefing.confirm_completion;
const debrief = showMessage(config, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

// START of Demographics Questionnaires
const demographicsAge = p(QUIZ_LANGUAGE.ask.demographics_age);
const demographicsPreamble1 = h1(QUIZ_LANGUAGE.prompt.preamble.demo_1);
const demographicsPreamble2 = h1(QUIZ_LANGUAGE.prompt.preamble.demo_2);
const demographicsPreamble3 = h1(QUIZ_LANGUAGE.prompt.preamble.demo_3);

const openAnswerQuestions = survey({
  preamble: demographicsPreamble1,
  stimulus: demographicsAge,
});

// multi_choice_questions
const demoMultiChoiceOptions = {
  ethnicity: [
    QUIZ_LANGUAGE.answer.demographics_ethnicity.hispanic_latino,
    QUIZ_LANGUAGE.answer.demographics_ethnicity.no_hispanic_latino,
  ],
  race: [
    QUIZ_LANGUAGE.answer.demographics_race.asian,
    QUIZ_LANGUAGE.answer.demographics_race.african_american,
    QUIZ_LANGUAGE.answer.demographics_race.caucasian,
    QUIZ_LANGUAGE.answer.demographics_race.native_american_alaskan,
    QUIZ_LANGUAGE.answer.demographics_race.native_hawaiian_pacific_islander,
    QUIZ_LANGUAGE.answer.demographics_race.other,
  ],
  yesNo: [
    QUIZ_LANGUAGE.answer.demographics_binary.yes,
    QUIZ_LANGUAGE.answer.demographics_binary.no,
  ],
  gender: [
    QUIZ_LANGUAGE.answer.demographics_gender.female,
    QUIZ_LANGUAGE.answer.demographics_gender.male,
    QUIZ_LANGUAGE.answer.demographics_gender.other,
  ],
};

const demoMultiChoicePrompts = [
  p(QUIZ_LANGUAGE.ask.demographics_ethnicity),
  p(QUIZ_LANGUAGE.ask.demographics_race),
  p(QUIZ_LANGUAGE.ask.demographics_english),
  p(QUIZ_LANGUAGE.ask.demographics_gender),
];

const multiChoiceQuestions = multiSurvey({
  preamble: demographicsPreamble2,
  prompts: demoMultiChoicePrompts,
  ansChoices: demoMultiChoiceOptions,
});

// multi_select_questions
const diagnosesQuestions = p(QUIZ_LANGUAGE.ask.diagnoses);

const diagnosesOptions = {
  diagnoses: [
    QUIZ_LANGUAGE.answer.demographics_diagnoses.no,
    QUIZ_LANGUAGE.answer.demographics_diagnoses.parkinsons,
    QUIZ_LANGUAGE.answer.demographics_diagnoses.schizophrenia,
    QUIZ_LANGUAGE.answer.demographics_diagnoses.ocd,
    QUIZ_LANGUAGE.answer.demographics_diagnoses.depression,
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

export { ageCheck, debrief, demographics, iusSurvey, sliderCheck };
