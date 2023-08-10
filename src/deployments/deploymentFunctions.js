import {
  on_finish as downloadFinish,
  validate_login as downloadValidate,
  on_data_update as downloadUpdate,
} from "./download";
import {
  on_finish as firebaseFinish,
  validate_login as firebaseValidate,
  on_data_update as firebaseUpdate,
} from "./firebase";
import {
  on_finish as localFinish,
  validate_login as localValidate,
  on_data_update as localUpdate,
} from "./local";
import {
  on_finish as psiturkFinish,
  validate_login as psiturkValidate,
  on_data_update as psiturkUpdate,
} from "./psiturk";

// TODO: This is not a feasible way of doing this?
// It's running all of the code - we only want to load functions being used (causing issues with electron)

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
