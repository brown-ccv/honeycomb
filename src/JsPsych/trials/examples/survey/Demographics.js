import jsPsychSurvey from '@jspsych/plugin-survey';

// TODO: Should these be in different files? Survey file with many questions?
const ageQuestion = {
  name: 'age',
  type: 'text',
  prompt: 'How old are you?', // TODO: Get from language file
  textbox_columns: 5,
  validation: /^[1-9]\d*$/, // Value must be a positive integer
  required: false,
};

const genderQuestion = {
  name: 'gender',
  type: 'multi-choice',
  prompt: 'What is your gender?', // TODO: Get from language file
  options: ['Male', 'Female', 'Other'], // TODO: Get from language file
};

// TODO: These are going to look weird until we have the JsPsych css file
export function createSurveyTrial() {
  //   const timeline = [
  // openAnswerQuestions, // age, sex
  // multiChoiceQuestions, // ethnicity, race, english_fluency
  // multiSelectQuestions, // diagnoses
  //   ];

  return {
    type: jsPsychSurvey,
    pages: [
      [ageQuestion, genderQuestion],
      [
        // TODO: Ethnicity, Race, fluent in english, etc questions
      ],
    ],
    title: 'Demographics', // TODO: Pass as prop
    button_label_next: 'Continue',
    button_label_back: 'Previous',
    button_label_finish: 'Submit',
    show_question_numbers: 'onPage',
  };
}

export const Survey = createSurveyTrial();
