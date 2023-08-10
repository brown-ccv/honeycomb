import {
  on_finish as downloadFinish,
  validate_login as downloadValidate,
  on_data_update as downloadUpdate,
} from "../deployments/download";
import {
  on_finish as firebaseFinish,
  validate_login as firebaseValidate,
  on_data_update as firebaseUpdate,
} from "../deployments/firebase";
import {
  on_finish as localFinish,
  validate_login as localValidate,
  on_data_update as localUpdate,
} from "../deployments/local";
import {
  on_finish as psiturkFinish,
  validate_login as psiturkValidate,
  on_data_update as psiturkUpdate,
} from "../deployments/psiturk";

//   TODO: The deployment files should probably export their functions in this syntax first?
export const DEPLOYMENT_FUNCTIONS = {
  validation: {
    download: downloadValidate,
    firebase: firebaseValidate,
    local: localValidate,
    psiturk: psiturkValidate,
  },
  update: {
    download: downloadUpdate,
    firebase: firebaseUpdate,
    local: localUpdate,
    psiturk: psiturkUpdate,
  },
  finish: {
    download: downloadFinish,
    firebase: firebaseFinish,
    local: localFinish,
    psiturk: psiturkFinish,
  },
};
