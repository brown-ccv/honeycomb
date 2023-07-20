import { showMessage } from '@brown-ccv/behavioral-task-trials';

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../../config/home.json';
import { language } from '../../language';
import { useOldConfig } from '../../../utils';

export function createEndExperimentTrial() {
  const oldConfig = useOldConfig(config);
  return showMessage(oldConfig, {
    duration: 5000,
    message: language.task.end,
  });
}

export const EndExperiment = createEndExperimentTrial();
