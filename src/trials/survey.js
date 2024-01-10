import jsPsychSurveyPlugin from "@jspsych/plugin-survey";

import { LANGUAGE } from "../config/main";

// The survey plugin includes additional styling
import "@jspsych/plugin-survey/css/survey.css";

const iusSurveyLanguage = LANGUAGE.trials.survey.ius;
/**
 *
 */
const iusSurvey = {
  type: jsPsychSurveyPlugin,
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

const demographicsSurveyLanguage = LANGUAGE.trials.survey.demographics;
/**
 *
 */
const demographicsSurvey = {
  type: jsPsychSurveyPlugin,
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

export { demographicsSurvey, iusSurvey };
