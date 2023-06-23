// Utilities specific to this app/task
// TODO 198: Only one utils file
import _ from 'lodash';

// initialize starting conditions for each trial within a block
export function generateStartingOptions(blockSettings) {
  const startingOptions = blockSettings.conditions.map((c) => {
    // Repeat each starting condition the same number of times
    return _.range(blockSettings.repeats_per_condition).map(() => c);
  });

  return _.shuffle(_.flatten(startingOptions));
}
