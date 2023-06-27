import { multiSurvey } from '@brown-ccv/behavioral-task-trials';

import { language } from '../../../language';

/**
 * Create a survey of Intolerance of Uncertainty Scale (IUS) questions
 */
// TODO: Use JsPsych survey prompts https://www.jspsych.org/7.3/plugins/survey/
export function createIUSSurvey() {
  const { answer, prompt } = language.quiz;

  // Header displayed over every question
  const surveyPreamble = prompt.preamble.survey_1;
  const iusPreamble = prompt.ius.preamble;

  // Question prompts
  const iusPrompts = [
    `${prompt.ius.upset}`,
    `${prompt.ius.frustration}`,
    `${prompt.ius.full_life}`,
    `${prompt.ius.surprise_avoid}`,
    `${prompt.ius.unforeseen_spoil}`,
    `${prompt.ius.uncertainty_paralysis}`,
    `${prompt.ius.uncertainty_malfunction}`,
    `${prompt.ius.future}`,
    `${prompt.ius.surprise_intolerance}`,
    `${prompt.ius.doubt_paralysis}`,
    `${prompt.ius.organize}`,
    `${prompt.ius.escape}`,
  ];

  // Answer choices for each prompt
  const choices = {
    options: [
      `${answer.ius.not}`,
      `${answer.ius.little}`,
      `${answer.ius.somewhat}`,
      `${answer.ius.very}`,
      `${answer.ius.entirely}`,
      `${answer.abstain}`,
    ],
  };

  // TODO: Separate multiSurvey into its own task in Honeycomb
  return multiSurvey({
    preamble: [surveyPreamble + iusPreamble],
    prompts: iusPrompts,
    ansChoices: choices,
  });
}

export const IUSSurvey = createIUSSurvey();
