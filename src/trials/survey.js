import { multiSurvey, showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyResponse from "@jspsych/plugin-survey"; // TODO: Rename survey

import { config, LANGUAGE } from "../config/main";
import { h1, p } from "../lib/markup/tags";

// The survey plugin includes additional styling
import "@jspsych/plugin-survey/css/survey.css";

const SURVEY_LANGUAGE = LANGUAGE.trials.survey;

// TODO #235: Refactor to jsPsych survey trials

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
    SURVEY_LANGUAGE.answer.abstain,
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

const iusSurveyNew = {};

// Debrief Page (non-mTurk)
const debriefOptions = SURVEY_LANGUAGE.answer.debriefing.confirm_completion;
const debrief = showMessage(config, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

const demographicsSurvey = {
  type: surveyResponse,
  title: SURVEY_LANGUAGE.demographics.title,
  pages: [
    [
      {
        type: "text",
        input_type: "number",
        name: "age",
        required: true,
        prompt: SURVEY_LANGUAGE.demographics.age.prompt,
      },
    ],
    [
      {
        type: "multi-choice",
        name: "ethnicity",
        required: true,
        prompt: SURVEY_LANGUAGE.demographics.ethnicity.prompt,
        options: SURVEY_LANGUAGE.demographics.ethnicity.options,
      },
      {
        type: "multi-choice",
        name: "race",
        required: true,
        prompt: SURVEY_LANGUAGE.demographics.race.prompt,
        options: SURVEY_LANGUAGE.demographics.race.options,
      },
      {
        type: "multi-choice",
        name: "english",
        required: true,
        prompt: SURVEY_LANGUAGE.demographics.english.prompt,
        options: SURVEY_LANGUAGE.demographics.english.options,
      },
      {
        type: "multi-choice",
        name: "gender",
        required: true,
        prompt: SURVEY_LANGUAGE.demographics.gender.prompt,
        options: SURVEY_LANGUAGE.demographics.gender.options,
      },
    ],
    [
      {
        type: "multi-select",
        name: "diagnoses",
        required: true,
        prompt: SURVEY_LANGUAGE.demographics.diagnoses.prompt,
        options: SURVEY_LANGUAGE.demographics.diagnoses.options,
      },
    ],
  ],
};

export { debrief, demographicsSurvey, iusSurvey, iusSurveyNew };
