import { slider } from '@brown-ccv/behavioral-task-trials';

// TODO: Use @signature for imports?
import { language } from '../../language'; // @language

// TODO: Move slider helper here from '@brown-ccv/behavioral-task-trials'
/**
 *
 */
function createSliderCheckTrial() {
  // TODO: Should I include the language here as an example? Have it be passed as a parameter?
  return slider(language.quiz.direction.slider.right);
}

export const SliderCheck = createSliderCheckTrial();
