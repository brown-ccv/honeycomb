import React, { useCallback, useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import { addToFirebase, validateParticipant } from "../firebase";

import JsPsychExperiment from "./JsPsychExperiment";
import Login from "./Login";
import Error from "./Error";

// Hard code for now
import { OLD_CONFIG } from "../constants";
import { TASK_VERSION } from "../JsPsych/constants";
import { getProlificId } from "../JsPsych/utils";

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
  const [currentMethod, setMethod] = useState("default");

  // Manage the electron renderer
  const [ipcRenderer, setIpcRenderer] = useState();
  // Manage the psiturk object
  const [psiturk, setPsiturk] = useState();

  // Manage user data
  const [participantID, setParticipantID] = useState("");
  const [studyID, setStudyID] = useState("");

  /**
   * This effect is called once, on the first render of the application
   * It uses the environment variables to initialize the above state variables
   */
  useEffect(() => {
    // For testing and debugging purposes
    console.log(OLD_CONFIG);

    // If on desktop
    if (OLD_CONFIG.USE_ELECTRON) {
      // conditionally load electron and psiturk based on MTURK config variable
      let ipcRenderer = false;
      try {
        const electron = window.require("electron");
        ipcRenderer = electron.ipcRenderer;
      } catch (e) {
        console.warn("window.require is not available");
        return; // Early return
      }

      ipcRenderer.send("updateEnvironmentVariables", OLD_CONFIG);

      // Fill in login fields based on environment variables (may still be blank)
      const credentials = ipcRenderer.sendSync("syncCredentials");
      setParticipantID(credentials.participantID || "");
      setStudyID(credentials.studyID || "");

      setMethod("desktop");
      setIpcRenderer(ipcRenderer);
    } else {
      // If MTURK
      if (OLD_CONFIG.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict();
        setPsiturk(new PsiTurk(turkUniqueId, "/complete"));
        setMethod("mturk");
        handleLogin("mturk", turkUniqueId);
        /* eslint-enable */
      } else if (OLD_CONFIG.USE_PROLIFIC) {
        const pID = getProlificId();
        if (OLD_CONFIG.USE_FIREBASE && pID) {
          setMethod("firebase");
          handleLogin("prolific", pID);
        } else {
          // Error - Prolific must be used with Firebase
          setIsError(true);
        }
      } else if (OLD_CONFIG.USE_FIREBASE) {
        // Fill in login fields based on query parameters (may still be blank)
        // Prolific will pass the studyID and participantID as search parameters in the URL
        // Please ensure the search params use the same name here
        const query = new URLSearchParams(window.location.search);
        setStudyID(query.get("studyID") || "");
        setParticipantID(query.get("participantID") || "");

        setMethod("firebase");
      } else {
        setMethod("default");
      }
    }
    // eslint-disable-next-line
  }, []);

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
  function defaultFunction() {
    return;
  }

  // Add trial data to Firestore
  function firebaseUpdateFunction(data) {
    addToFirebase(data);
  }
  // Execute the "data" callback function (see public/electron.js)
  function desktopUpdateFunction(data) {
    ipcRenderer.send("data", data);
  }
  // Add trial data to psiturk
  function psiturkUpdateFunction(data) {
    psiturk.recordTrialData(data);
  }

  /** EXPERIMENT FINISH FUNCTIONS */

  // Save the experiment data on the desktop
  function defaultFinishFunction(data) {
    data.localSave("csv", "neuro-task.csv");
  }

  // Execute the "end" callback function (see public/electron.js)
  function desktopFinishFunction() {
    ipcRenderer.send("end", "true");
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
        OLD_CONFIG={OLD_CONFIG}
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
