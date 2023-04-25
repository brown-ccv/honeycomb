import React, { useCallback, useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import '../index.css';

import { config, taskVersion, turkUniqueId } from '../config/main';
import { addToFirebase, validateParticipant } from '../firebase';
import { getProlificId } from '../lib/utils';

import JsPsychExperiment from './JsPsychExperiment';
import Login from './Login';
import Error from './Error';

/** Top-level React component for Honeycomb.
 *
 * This component stores the state of the app.
 * This lets us determine what the app is running on (Electron, Firebase, PsiTurk, or MTurk).
 * It also lets us pass data between <Login> and <JsPsychExperiment />
 */
function App() {
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
    console.log(config);

    // If on desktop
    if (config.USE_ELECTRON) {
      // TODO: ipcRenderer is a state variable? Is that okay?
      const { ipcRenderer } = window.require('electron');
      setIpcRenderer(ipcRenderer);
      ipcRenderer.send('updateEnvironmentVariables', config);

      // Fill in login fields based on environment variables (may still be blank)
      const credentials = ipcRenderer.sendSync('syncCredentials');
      setParticipantID(credentials.participantID || '');
      setStudyID(credentials.studyID || '');

      setMethod('desktop');
    } else {
      // If MTURK
      if (config.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict()
        setPsiturk(new PsiTurk(turkUniqueId, '/complete'))
        setMethod('mturk')
        // TODO 145: Function signature
        handleLogin('mturk', turkUniqueId)
        /* eslint-enable */
      } else if (config.USE_PROLIFIC) {
        const pID = getProlificId();
        if (config.USE_FIREBASE && pID) {
          setMethod('firebase');
          // TODO 145: Function signature
          handleLogin('prolific', pID);
        } else {
          // Error - Prolific must be used with Firebase
          setIsError(true);
        }
      } else if (config.USE_FIREBASE) {
        // Fill in login fields based on query parameters (may still be blank)
        // TODO: Add explanation about PsiTurk here
        const query = new URLSearchParams(window.location.search);
        setParticipantID(query.get('participantID') || '');
        setStudyID(query.get('studyID') || '');

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
  const defaultValidation = async () => true;
  // Validate participant/study against Firestore rules
  const firebaseValidation = (studyID, participantID) => {
    return validateParticipant(studyID, participantID);
  };

  /** DATA WRITE FUNCTIONS */

  const defaultFunction = () => {};
  // Add trial data to Firestore
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data);
  };
  // Execute the 'data' callback function (see public/electron.js)
  const desktopUpdateFunction = (data) => {
    ipcRenderer.send('data', data);
  };
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data);
  };

  /** EXPERIMENT FINISH FUNCTIONS */

  // Save the experiment data on the desktop
  const defaultFinishFunction = (data) => {
    data.localSave('csv', 'neuro-task.csv');
  };
  // Execute the 'end' callback function (see public/electron.js)
  const desktopFinishFunction = () => {
    ipcRenderer.send('end', 'true');
  };
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData({
        success: () => psiturk.completeHIT(),
        error: () => setIsError(true),
      });
    };
    completePsiturk();
  };

  // Update the study/participant data when they log in
  const handleLogin = useCallback((studyID, participantID) => {
    setStudyID(studyID);
    setParticipantID(participantID);
    setLoggedIn(true);
  }, []);

  // TODO: Everything should be inside the centered-h-v, don't need to add in Login, JsPsych, etc
  if (isError) {
    return <Error />;
  } else {
    return loggedIn ? (
      <JsPsychExperiment
        studyID={studyID}
        participantID={participantID}
        taskVersion={taskVersion}
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
