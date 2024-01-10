import { multiSurvey, showMessage, survey } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyMultiselect from "@jspsych/plugin-survey-multi-select";

import { config, LANGUAGE } from "../config/main";
import { h1, p } from "../lib/markup/tags";

const SURVEY_LANGUAGE = LANGUAGE.trials.survey;

// TODO #235: Refactor to jsPsych survey trials

const abstain = SURVEY_LANGUAGE.answer.abstain; // give people choice to abstain

// Survey page headers
const surveyPreamble1 = h1(SURVEY_LANGUAGE.prompt.preamble.survey_1);
const surveyPreamble2 =
  p(SURVEY_LANGUAGE.prompt.ius.preamble.start) +
  p(SURVEY_LANGUAGE.prompt.ius.preamble.middle) +
  p(SURVEY_LANGUAGE.prompt.ius.preamble.end);

// Intolerance of Uncertainty (IUS) Scale
const iusOptions = {
  options: [
    SURVEY_LANGUAGE.answer.ius.not,
    SURVEY_LANGUAGE.answer.ius.little,
    SURVEY_LANGUAGE.answer.ius.somewhat,
    SURVEY_LANGUAGE.answer.ius.very,
    SURVEY_LANGUAGE.answer.ius.entirely,
    abstain,
  ],
};

const iusPrompts = [
  SURVEY_LANGUAGE.prompt.ius.upset,
  SURVEY_LANGUAGE.prompt.ius.frustration,
  SURVEY_LANGUAGE.prompt.ius.full_life,
  SURVEY_LANGUAGE.prompt.ius.surprise_avoid,
  SURVEY_LANGUAGE.prompt.ius.unforeseen_spoil,
  SURVEY_LANGUAGE.prompt.ius.uncertainty_paralysis,
  SURVEY_LANGUAGE.prompt.ius.uncertainty_malfunction,
  SURVEY_LANGUAGE.prompt.ius.future,
  SURVEY_LANGUAGE.prompt.ius.surprise_intolerance,
  SURVEY_LANGUAGE.prompt.ius.doubt_paralysis,
  SURVEY_LANGUAGE.prompt.ius.organize,
  SURVEY_LANGUAGE.prompt.ius.escape,
];

const iusSurvey = multiSurvey({
  preamble: [surveyPreamble1 + surveyPreamble2],
  prompts: iusPrompts,
  ansChoices: iusOptions,
});

// Debrief Page (non-mTurk)
const debriefOptions = SURVEY_LANGUAGE.answer.debriefing.confirm_completion;
const debrief = showMessage(config, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

// START of Demographics Questionnaires
const demographicsAge = p(SURVEY_LANGUAGE.ask.demographics_age);
const demographicsPreamble1 = h1(SURVEY_LANGUAGE.prompt.preamble.demo_1);
const demographicsPreamble2 = h1(SURVEY_LANGUAGE.prompt.preamble.demo_2);
const demographicsPreamble3 = h1(SURVEY_LANGUAGE.prompt.preamble.demo_3);

const openAnswerQuestions = survey({
  preamble: demographicsPreamble1,
  stimulus: demographicsAge,
});

// multi_choice_questions
const demoMultiChoiceOptions = {
  ethnicity: [
    SURVEY_LANGUAGE.answer.demographics_ethnicity.hispanic_latino,
    SURVEY_LANGUAGE.answer.demographics_ethnicity.no_hispanic_latino,
  ],
  race: [
    SURVEY_LANGUAGE.answer.demographics_race.asian,
    SURVEY_LANGUAGE.answer.demographics_race.african_american,
    SURVEY_LANGUAGE.answer.demographics_race.caucasian,
    SURVEY_LANGUAGE.answer.demographics_race.native_american_alaskan,
    SURVEY_LANGUAGE.answer.demographics_race.native_hawaiian_pacific_islander,
    SURVEY_LANGUAGE.answer.demographics_race.other,
  ],
  yesNo: [
    SURVEY_LANGUAGE.answer.demographics_binary.yes,
    SURVEY_LANGUAGE.answer.demographics_binary.no,
  ],
  gender: [
    SURVEY_LANGUAGE.answer.demographics_gender.female,
    SURVEY_LANGUAGE.answer.demographics_gender.male,
    SURVEY_LANGUAGE.answer.demographics_gender.other,
  ],
};

const demoMultiChoicePrompts = [
  p(SURVEY_LANGUAGE.ask.demographics_ethnicity),
  p(SURVEY_LANGUAGE.ask.demographics_race),
  p(SURVEY_LANGUAGE.ask.demographics_english),
  p(SURVEY_LANGUAGE.ask.demographics_gender),
];

const multiChoiceQuestions = multiSurvey({
  preamble: demographicsPreamble2,
  prompts: demoMultiChoicePrompts,
  ansChoices: demoMultiChoiceOptions,
});

// multi_select_questions
const diagnosesQuestions = p(SURVEY_LANGUAGE.ask.diagnoses);

const diagnosesOptions = {
  diagnoses: [
    SURVEY_LANGUAGE.answer.demographics_diagnoses.no,
    SURVEY_LANGUAGE.answer.demographics_diagnoses.parkinsons,
    SURVEY_LANGUAGE.answer.demographics_diagnoses.schizophrenia,
    SURVEY_LANGUAGE.answer.demographics_diagnoses.ocd,
    SURVEY_LANGUAGE.answer.demographics_diagnoses.depression,
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

export { debrief, demographics, iusSurvey };
