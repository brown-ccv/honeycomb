import React, { useCallback, useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import JsPsychExperiment from "./JsPsychExperiment";
import Login from "./Login";
import Error from "./Error";

import { OLD_CONFIG, LOCATION, DEPLOYMENT, NODE_ENV } from "../constants";
import { getQueryVariable } from "../utils";

import { TASK_VERSION } from "../JsPsych/constants";
import {
  on_data_update as downloadUpdate,
  on_finish as downloadFinish,
  validate_login as downloadLogin,
} from "../deployments/download";
import {
  on_data_update as firebaseUpdate,
  validate_login as firebaseLogin,
} from "../deployments/firebase";

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
  // TODO: Refactor to be the error message itself or null
  const [isError, setIsError] = useState(false);

  // Manage the method state of the app ("download", "local", "firebase", "mturk")
  // TODO: Will just be DEPLOYMENT?
  const [currentMethod, setMethod] = useState("download");

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
    // Logs for testing
    console.log("NODE_ENV:\t", NODE_ENV);
    console.log("LOCATION:\t", LOCATION);
    console.log("DEPLOYMENT:\t", DEPLOYMENT);

    // TODO: Refactor to switch
    if (LOCATION === "clinic") {
      // Running in an Electron process
      let renderer;
      try {
        // Load the Electron renderer process and psiturk based on MTURK config variable
        renderer = window.require("electron").ipcRenderer;
        renderer.send("updateEnvironmentVariables", OLD_CONFIG); // USE_EEG and USE_CAMERA

        // Fill in login fields based on environment variables (may still be blank)
        // TODO: Can this be done with URLSearchParams?
        const credentials = renderer.sendSync("syncCredentials");
        setParticipantID(credentials.participantID || "");
        setStudyID(credentials.studyID || "");

        setIpcRenderer(renderer);
      } catch (e) {
        console.error("Unable to instantiate the Electron process", e);
      }
    } else {
      // Running in the Browser

      // TODO: Can we use searURLSearchParams in Electron?
      // Fill in login fields based on query parameters (may still be blank)
      // Prolific will pass the studyID and participantID as search parameters in the URL
      const query = new URLSearchParams(window.location.search);
      setStudyID(query.get("studyID") || "");
      setParticipantID(query.get("participantID") || "");
    }

    switch (DEPLOYMENT) {
      case "download":
        // Data is downloaded as a CSV file at the end of the experiment
        setMethod("download");
        break;
      case "local":
        // Save to a local JSON file with Honeycomb/studyID/participantID/[startDate] folder structure
        break;
      case "firebase": {
        // Data is saved in Firebase's Firestore database
        setMethod("firebase");
        break;
      }
      case "prolific": {
        // TODO: Prolific will be deleted
        // Logs with with studyID as prolific and participantID as <pID>
        const pID = getQueryVariable("PROLIFIC_PID");
        handleLogin("prolific", pID);

        // Prolific currently uses the Firebase CRUD functions
        setMethod("firebase");
        break;
      }
      case "psiturk":
        {
          /* eslint-disable */
          // ? This is using all the JavaScript min files?
          window.lodash = _.noConflict();
          setPsiturk(new PsiTurk(turkUniqueId, "/complete"));

          // Logs with with studyID as mturk and participantID as <pID>
          handleLogin("mturk", turkUniqueId);
          setMethod("mturk");
          /* eslint-enable */
        }
        break;
      // TODO: Add XAMPP support and instructions https://www.jspsych.org/7.3/overview/data/#storing-data-permanently-as-a-file
      // TODO: Add MySQL support and instructions https://www.jspsych.org/7.3/overview/data/#storing-data-permanently-in-a-mysql-database
      case "custom": // TODO: User will have to provide the data functions to <Honeycomb />
      default:
        setIsError(true);
        console.error("process.env.DEPLOYMENT is invalid or not set: ");
        break;
    }
    // eslint-disable-next-line
  }, []);

  /** VALIDATION FUNCTIONS */

  // More information about the arrow function syntax can be found here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

  // Validate participant/study against Firestore rules
  // function firebaseValidation(studyID, participantID) {
  //   return validateParticipant(studyID, participantID);
  // }

  /** DATA WRITE FUNCTIONS */

  // TODO 157: Have an object of functions, accessed by the config variable

  // Add trial data to Firestore
  // function firebaseUpdateFunction(data) {
  //   addToFirebase(data);
  // }
  // Execute the "data" callback function (see public/electron.js)
  function desktopUpdateFunction(data) {
    ipcRenderer.send("data", data);
  }
  // Add trial data to psiturk
  function psiturkUpdateFunction(data) {
    psiturk.recordTrialData(data);
  }

  /** EXPERIMENT FINISH FUNCTIONS */

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
        config={OLD_CONFIG}
        studyID={studyID}
        participantID={participantID}
        taskVersion={TASK_VERSION}
        dataUpdateFunction={
          {
            desktop: desktopUpdateFunction,
            firebase: firebaseUpdate,
            mturk: psiturkUpdateFunction,
            default: downloadUpdate,
          }[currentMethod]
        }
        dataFinishFunction={
          {
            desktop: desktopFinishFunction,
            mturk: psiturkFinishFunction,
            firebase: undefined,
            default: downloadFinish,
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
            desktop: undefined,
            default: downloadLogin,
            firebase: firebaseLogin,
          }[currentMethod]
        }
      />
    );
  }
}

export default App;
