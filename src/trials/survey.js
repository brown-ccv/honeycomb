import { showMessage } from "@brown-ccv/behavioral-task-trials";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";
import surveyResponse from "@jspsych/plugin-survey"; // TODO: Rename survey

import { config, LANGUAGE } from "../config/main";

// The survey plugin includes additional styling
import "@jspsych/plugin-survey/css/survey.css";

const SURVEY_LANGUAGE = LANGUAGE.trials.survey;
const iusSurveyLanguage = SURVEY_LANGUAGE.ius;
const demographicsSurveyLanguage = SURVEY_LANGUAGE.demographics;

/**
 *
 */
const iusSurvey = {
  type: surveyResponse,
  title: iusSurveyLanguage.title,
  pages: [
    [
      {
        type: "likert-table",
        name: "ius",
        prompt: iusSurveyLanguage.prompt,
        statements: iusSurveyLanguage.statements,
        options: iusSurveyLanguage.options,
      },
    ],
  ],
};

/**
 *
 */
const demographicsSurvey = {
  type: surveyResponse,
  title: demographicsSurveyLanguage.title,
  pages: [
    [
      {
        type: "text",
        input_type: "number",
        name: "age",
        required: true,
        prompt: demographicsSurveyLanguage.age.prompt,
      },
    ],
    [
      {
        type: "multi-choice",
        name: "ethnicity",
        required: true,
        prompt: demographicsSurveyLanguage.ethnicity.prompt,
        options: demographicsSurveyLanguage.ethnicity.options,
      },
      {
        type: "multi-choice",
        name: "race",
        required: true,
        prompt: demographicsSurveyLanguage.race.prompt,
        options: demographicsSurveyLanguage.race.options,
      },
      {
        type: "multi-choice",
        name: "english",
        required: true,
        prompt: demographicsSurveyLanguage.english.prompt,
        options: demographicsSurveyLanguage.english.options,
      },
      {
        type: "multi-choice",
        name: "gender",
        required: true,
        prompt: demographicsSurveyLanguage.gender.prompt,
        options: demographicsSurveyLanguage.gender.options,
      },
    ],
    [
      {
        type: "multi-select",
        name: "diagnoses",
        required: true,
        prompt: demographicsSurveyLanguage.diagnoses.prompt,
        options: demographicsSurveyLanguage.diagnoses.options,
      },
    ],
  ],
};

// Debrief Page
// TODO: Refactor to NO_KEYS trial
const debriefOptions = SURVEY_LANGUAGE.debriefing.confirm_completion;
const debrief = showMessage(config, {
  responseType: htmlButtonResponse,
  responseEndsTrial: true,
  buttons: [debriefOptions],
});

export { debrief, demographicsSurvey, iusSurvey };
