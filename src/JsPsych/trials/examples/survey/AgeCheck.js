import { survey } from '@brown-ccv/behavioral-task-trials';

// TODO: Use @signature for imports?
import { language } from '../../../language'; // @language

// TODO: Move survey helper here from '@brown-ccv/behavioral-task-trials'
/**
 *  Asks the user to
 * @returns
 */
function createAgeCheckTrial() {
  const askAge = language.quiz.ask.age;
  const answerAge = language.quiz.answer.age;
  const ageCheck = survey({
    stimulus: `<div class='instructions'><h1>${askAge}<br><b>${answerAge}</b></div>`,
  });

  return ageCheck;
}

export const AgeCheck = createAgeCheckTrial();
