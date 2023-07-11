import SurveyMultiSelectPlugin from '@jspsych/plugin-survey-multi-select';

// TODO: Use @signature for imports?
import { language } from '../../../language'; // @language
import { multiSurvey, survey } from '@brown-ccv/behavioral-task-trials';

/**
 * Creates a survey page for demographics information
 * @returns C
 */
// TODO: Use JsPsych survey prompts https://www.jspsych.org/7.3/plugins/survey/
export function createDemographicsSurvey() {
  const { ask, prompt, answer } = language.quiz;

  // Header displayed over every question
  const preamble1 = prompt.preamble.demo_1;
  const preamble2 = prompt.preamble.demo_2;
  const preamble3 = prompt.preamble.demo_3;

  // TODO: Bring survey task into Honeycomb
  const ageQuestion = survey({
    preamble: preamble1,
    stimulus: ask.demographics_age,
  });

  /** MULTI CHOICE QUESTIONS */

  // TODO: Use JsPsych single choice plugin type

  // Question prompts
  const multiChoicePrompts = [
    `${ask.demographics_ethnicity}`,
    `${ask.demographics_race}`,
    `${ask.demographics_english}`,
    `${ask.demographics_gender}`,
  ];

  // Answer choices for each prompt
  const multiChoiceOptions = {
    ethnicity: [
      answer.demographics_ethnicity.hispanic_latino,
      answer.demographics_ethnicity.no_hispanic_latino,
    ],
    race: [
      `${answer.demographics_race.asian}`,
      `${answer.demographics_race.african_american}`,
      `${answer.demographics_race.caucasian}`,
      `${answer.demographics_race.native_american_alaskan}`,
      `${answer.demographics_race.native_hawaiian_pacific_islander}`,
      `${answer.demographics_race.other}`,
    ],
    yesNo: [answer.demographics_binary.yes, answer.demographics_binary.no],
    gender: [
      answer.demographics_gender.female,
      answer.demographics_gender.male,
      answer.demographics_gender.other,
    ],
  };

  const multiChoiceQuestions = multiSurvey({
    preamble: preamble2,
    prompts: multiChoicePrompts,
    ansChoices: multiChoiceOptions,
  });

  /** MULTI SELECT QUESTIONS */
  // TODO: Use JsPsych single choice plugin type

  const diagnosesQuestion = ask.diagnoses;
  const diagnosesOptions = {
    diagnoses: [
      answer.demographics_diagnoses.no,
      answer.demographics_diagnoses.parkinsons,
      answer.demographics_diagnoses.schizophrenia,
      answer.demographics_diagnoses.ocd,
      answer.demographics_diagnoses.depression,
    ],
  };

  const multiSelectQuestions = multiSurvey({
    responseType: SurveyMultiSelectPlugin,
    preamble: preamble3,
    prompts: [diagnosesQuestion],
    ansChoices: diagnosesOptions,
  });

  // demographics
  // TODO 162: Move everything up into a demographics function
  return {
    timeline: [
      ageQuestion, // TODO: Sex question?
      multiChoiceQuestions, // ethnicity, race, english_fluency, sex
      multiSelectQuestions, // diagnoses
    ],
  };
}

export const DemographicsSurvey = createDemographicsSurvey();
