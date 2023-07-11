import { survey } from '@brown-ccv/behavioral-task-trials';

// TODO 204: Use @signature for imports?
import { language } from '../../language'; // @language

/**
 *  Asks the user to
 * @returns
 */
export function createAgeCheckTrial() {
  const askAge = language.quiz.ask.age;
  const answerAge = language.quiz.answer.age;
  const ageCheck = survey({
    stimulus: `<div class='instructions'><h1>${askAge}<br><b>${answerAge}</b></div>`,
  });

  return ageCheck;
}

export const AgeCheck = createAgeCheckTrial();
