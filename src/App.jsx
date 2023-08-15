import React, { useCallback, useEffect, useState } from "react";

import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import JsPsychExperiment from "./components/JsPsychExperiment";
import Login from "./components/Login";

import { config, taskVersion, turkUniqueId } from "./config/main";
import { addToFirebase, validateParticipant } from "./firebase";
import { getProlificId } from "./lib/utils";

/**
 * The top-level React component for Honeycomb. App handles initiating the jsPsych component when the participant
 * successfully logs in, and stores the overall state of the experiment. Importantly, App keeps track of what the
 * experiment is running on (Electron, Firebase, PsiTurk, or MTurk).
 *
 * Note that App is a functional component, which means it uses React callbacks rather than class methods. Learn more
 * about functional vs. class components here: https://reactjs.org/docs/components-and-props.html. It is recommended
 * to use functional components.
 */
function App() {
  // Manage if a user is currently logged in
  const [loggedIn, setLoggedIn] = useState(false);
  // Manage error state of the app
  const [isError, setIsError] = useState(false);

  // Manage the electron renderer
  const [ipcRenderer, setIpcRenderer] = useState();
  // Manage the psiturk object
  const [psiturk, setPsiturk] = useState(false);

  // Manage the data used in the experiment
  const [participantID, setParticipantID] = useState("");
  const [studyID, setStudyID] = useState("");

  // Manage the method type being used ("desktop", "firebase", "mturk", or "default")
  const [currentMethod, setMethod] = useState("default");

  /**
   * This effect is called once, on the first render of the application
   * It checks the environment variables to initialize needed state variables
   * And determines which methods to be using
   */
  useEffect(() => {
    // For testing and debugging purposes
    console.log(config);

    // If on desktop
    if (config.USE_ELECTRON) {
      const { ipcRenderer } = window.require("electron");
      setIpcRenderer(ipcRenderer);

      // TODO: I don't think this is using the ipcRenderer from state? Is that okay?
      ipcRenderer.send("updateEnvironmentVariables", config);
      // Fill in login fields based on environment variables (may still be blank)
      const credentials = ipcRenderer.sendSync("syncCredentials");
      if (credentials.participantID) setParticipantID(credentials.participantID);
      if (credentials.studyID) setStudyID(credentials.studyID);

      setMethod("desktop");
    } else {
      // If MTURK
      if (config.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict();
        setPsiturk(new PsiTurk(turkUniqueId, '/complete'));
        setMethod('mturk');
        handleLogin('mturk', turkUniqueId);
        /* eslint-enable */
      } else if (config.USE_PROLIFIC) {
        const pID = getProlificId();
        if (config.USE_FIREBASE && pID) {
          setMethod("firebase");
          handleLogin("prolific", pID);
        } else {
          // Error - Prolific must be used with Firebase
          setIsError(true);
        }
      } else if (config.USE_FIREBASE) {
        // Fill in login fields based on query parameters (may still be blank)
        const query = new URLSearchParams(window.location.search);
        const studyId = query.get("studyID");
        const participantId = query.get("participantID");
        if (studyId) setStudyID(studyId);
        if (participantId) setParticipantID(participantId);

        setMethod("firebase");
      } else {
        setMethod("default");
      }
    }
    // eslint-disable-next-line
  }, []);

  /** VALIDATION FUNCTIONS */

  // Default to valid
  const defaultValidation = async () => true;
  // Validate participant/study against Firestore rules
  const firebaseValidation = (studyId, participantId) => {
    return validateParticipant(studyId, participantId);
  };

  /** DATA WRITE FUNCTIONS */

  const defaultFunction = () => {};
  // Add trial data to Firestore
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data);
  };
  // Execute the 'data' callback function (see public/electron.js)
  const desktopUpdateFunction = (data) => {
    ipcRenderer.send("data", data);
  };
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data);
  };

  /** EXPERIMENT FINISH FUNCTIONS */

  // Save the experiment data on the desktop
  const defaultFinishFunction = (data) => {
    data.localSave("csv", "neuro-task.csv");
  };
  // Execute the 'end' callback function (see public/electron.js)
  const desktopFinishFunction = () => {
    ipcRenderer.send("end", "true");
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
  const handleLogin = useCallback((studyId, participantId) => {
    setStudyID(studyId);
    setParticipantID(participantId);
    setLoggedIn(true);
  }, []);

  if (isError) {
    return (
      <div className="centered-h-v">
        <div className="width-50 alert alert-danger">
          Please ask your task provider to enable firebase.
        </div>
      </div>
    );
  } else {
    return (
      <>
        {loggedIn ? (
          <JsPsychExperiment
            studyId={studyID}
            participantId={participantID}
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
          <Login
            validationFunction={
              {
                desktop: defaultValidation,
                default: defaultValidation,
                firebase: firebaseValidation,
              }[currentMethod]
            }
            initialStudyID={studyID}
            initialParticipantID={participantID}
            handleLogin={handleLogin}
          />
        )}
      </>
    );
  }
}

export default App;
