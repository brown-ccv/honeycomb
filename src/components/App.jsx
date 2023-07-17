import React, { useCallback, useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

import { addToFirebase, validateParticipant } from '../firebase';

import JsPsychExperiment from './JsPsychExperiment';
import Login from './Login';
import Error from './Error';

// TODO 226: This is a task, how do I pass which config file to use?
// Hard code for now
import config from '../JsPsych/config/home.json';
import { TASK_VERSION } from '../JsPsych/constants';
import { getProlificId } from '../JsPsych/utils';

function useOldConfig(newConfig) {
  const { environment, equipment } = newConfig;

  return {
    USE_ELECTRON: environment === 'electron',
    USE_FIREBASE: environment === 'firebase',
    USE_MTURK: false, // TODO 229: What's the logic for this? Is it its own environment?
    USE_PROLIFIC: false, // TODO 228: We'll be removing prolific -> passed as URLSearchParam
    USE_PHOTODIODE: equipment.photodiode ? true : false,
    USE_EEG: equipment.eeg ? true : false,
    USE_VOLUME: equipment.audio ? true : false,
    USE_CAMERA: equipment.camera ? true : false,
  };
}

/** Top-level React component for Honeycomb.
 *
 * This component stores the state of the app.
 * This lets us determine what the app is running on (Electron, Firebase, PsiTurk, or MTurk).
 * It also lets us pass data between <Login> and <JsPsychExperiment />
 */
function App() {
  const oldConfig = useOldConfig(config);

  // Manage user state of the app
  const [loggedIn, setLoggedIn] = useState(false);
  // Manage error state of the app
  const [isError, setIsError] = useState(false);
  // Manage the method state of the app ("desktop", "firebase", "mturk", or "default")
  const [currentMethod, setMethod] = useState('default');

  // Manage the electron renderer
  const [ipcRenderer, setIpcRenderer] = useState();
  // Manage the psiturk object
  const [psiturk, setPsiturk] = useState();

  // Manage user data
  const [participantID, setParticipantID] = useState('');
  const [studyID, setStudyID] = useState('');

  /**
   * This effect is called once, on the first render of the application
   * It uses the environment variables to initialize the above state variables
   */
  useEffect(() => {
    // For testing and debugging purposes
    console.log(config, oldConfig);

    // If on desktop
    if (oldConfig.USE_ELECTRON) {
      // conditionally load electron and psiturk based on MTURK config variable
      let ipcRenderer = false;
      try {
        const electron = window.require('electron');
        ipcRenderer = electron.ipcRenderer;
      } catch (e) {
        console.warn('window.require is not available');
        return; // Early return
      }

      ipcRenderer.send('updateEnvironmentVariables', oldConfig);

      // Fill in login fields based on environment variables (may still be blank)
      const credentials = ipcRenderer.sendSync('syncCredentials');
      setParticipantID(credentials.participantID || '');
      setStudyID(credentials.studyID || '');

      setMethod('desktop');
      setIpcRenderer(ipcRenderer);
    } else {
      // If MTURK
      if (oldConfig.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict();
        setPsiturk(new PsiTurk(turkUniqueId, '/complete'));
        setMethod('mturk');
        handleLogin('mturk', turkUniqueId);
        /* eslint-enable */
      } else if (oldConfig.USE_PROLIFIC) {
        const pID = getProlificId();
        if (oldConfig.USE_FIREBASE && pID) {
          setMethod('firebase');
          handleLogin('prolific', pID);
        } else {
          // Error - Prolific must be used with Firebase
          setIsError(true);
        }
      } else if (oldConfig.USE_FIREBASE) {
        // Fill in login fields based on query parameters (may still be blank)
        // Prolific will pass the studyID and participantID as search parameters in the URL
        // Please ensure the search params use the same name here
        const query = new URLSearchParams(window.location.search);
        setStudyID(query.get('studyID') || '');
        setParticipantID(query.get('participantID') || '');

        setMethod('firebase');
      } else {
        setMethod('default');
      }
    }
    // eslint-disable-next-line
  }, [])

  /** VALIDATION FUNCTIONS */

  // More information about the arrow function syntax can be found here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

  // Default to valid
  async function defaultValidation() {
    return true;
  }
  // Validate participant/study against Firestore rules
  function firebaseValidation(studyID, participantID) {
    return validateParticipant(studyID, participantID);
  }

  /** DATA WRITE FUNCTIONS */

  // TODO 157: Separate file for update/finish functions
  // TODO 157: Have an object of functions, accessed by the config variable
  // Do nothing
  function defaultFunction() {}
  // Add trial data to Firestore
  function firebaseUpdateFunction(data) {
    addToFirebase(data);
  }
  // Execute the 'data' callback function (see public/electron.js)
  function desktopUpdateFunction(data) {
    ipcRenderer.send('data', data);
  }
  // Add trial data to psiturk
  function psiturkUpdateFunction(data) {
    psiturk.recordTrialData(data);
  }

  /** EXPERIMENT FINISH FUNCTIONS */

  // Save the experiment data on the desktop
  function defaultFinishFunction(data) {
    data.localSave('csv', 'neuro-task.csv');
  }

  // Execute the 'end' callback function (see public/electron.js)
  function desktopFinishFunction() {
    ipcRenderer.send('end', 'true');
  }
  function psiturkFinishFunction() {
    const completePsiturk = async () => {
      psiturk.saveData({
        success: () => psiturk.completeHIT(),
        error: () => setIsError(true),
      });
    };
    completePsiturk();
  }

  // Update the study/participant data when they log in
  const handleLogin = useCallback((studyID, participantID) => {
    setStudyID(studyID);
    setParticipantID(participantID);
    setLoggedIn(true);
  }, []);

  if (isError) {
    return <Error />;
  } else {
    return loggedIn ? (
      <JsPsychExperiment
        oldConfig={oldConfig}
        studyID={studyID}
        participantID={participantID}
        taskVersion={TASK_VERSION}
        dataUpdateFunction={
          {
            desktop: desktopUpdateFunction,
            firebase: firebaseUpdateFunction,
            mturk: psiturkUpdateFunction,
            default: defaultFunction,
          }[currentMethod]
        }
        dataFinishFunction={
          {
            desktop: desktopFinishFunction,
            mturk: psiturkFinishFunction,
            firebase: defaultFunction,
            default: defaultFinishFunction,
          }[currentMethod]
        }
      />
    ) : (
      // Not logged in - display login screen
      <Login
        studyID={studyID}
        setStudyID={setStudyID}
        participantID={participantID}
        setParticipantID={setParticipantID}
        handleLogin={handleLogin}
        validationFunction={
          {
            desktop: defaultValidation,
            default: defaultValidation,
            firebase: firebaseValidation,
          }[currentMethod]
        }
      />
    );
  }
}

export default App;
