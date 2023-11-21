import React from "react";

// Import css styling
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "jspsych/css/jspsych.css";
import "./App.css";
import "./index.css";

// Import React components
import Error from "./components/Error";
import JsPsychExperiment from "./components/JsPsychExperiment";
import Login from "./components/Login";

// Import deployment functions
import { addToFirebase, validateParticipant } from "./deployments/firebase";

// Import configurations and utilities
import { config, taskSettings, taskVersion, turkUniqueId } from "../config/main";
import * as trigger from "../config/trigger";
import { getProlificId } from "../lib/utils";

/**
 * The top-level React component for Honeycomb. App handles initiating the jsPsych component when the participant
 * successfully logs in, and stores the overall state of the experiment. Importantly, App keeps track of what the
 * experiment is running on (Electron, Firebase, PsiTurk, or MTurk).
 *
 * Note that App is a functional component, which means it uses React callbacks rather than class methods. Learn more
 * about functional vs. class components here: https://reactjs.org/docs/components-and-props.html. It is recommended
 * to use functional components.
 */
export default function App() {
  // Manage if a user is currently logged in
  const [loggedIn, setLoggedIn] = React.useState(false);
  // Manage error state of the app
  const [isError, setIsError] = React.useState(false);

  // Manage the psiturk object
  const [psiturk, setPsiturk] = React.useState(false);

  // Manage the data used in the experiment
  const [participantID, setParticipantID] = React.useState("");
  const [studyID, setStudyID] = React.useState("");

  // Manage the method type being used ("desktop", "firebase", "mturk", or "default")
  const [currentMethod, setMethod] = React.useState("default");

  /**
   * This effect is called once, on the first render of the application
   * It checks the environment variables to initialize needed state variables
   * And determines which methods to be using
   */
  React.useEffect(() => {
    async function setUpHoneycomb() {
      // For testing and debugging purposes
      console.log({
        "Honeycomb Configuration": config,
        "Task Settings": taskSettings,
      });

      // If running in a native application
      if (config.USE_ELECTRON) {
        await window.electronAPI.setConfig(config); // Pass config to Electron ipcMain
        await window.electronAPI.setTrigger(trigger); // Pass trigger to Electron ipcMain

        // Fill in login fields based on environment variables (may still be blank)
        const credentials = await window.electronAPI.getCredentials();
        if (credentials.participantID) setParticipantID(credentials.participantID);
        if (credentials.studyID) setStudyID(credentials.studyID);

        // Ensure EEG is connected if using it
        if (config.USE_EEG) await window.electronAPI.checkEegPort();

        setMethod("desktop");
      } else {
        // If using Mechanical Turk and PsiTurk
        // TODO: Change config variable to psiturk? That's what user's are really using
        if (config.USE_MTURK) {
          /* eslint-disable */
          window.lodash = _.noConflict();
          setPsiturk(new PsiTurk(turkUniqueId, "/complete"));
          setMethod("mturk");
          handleLogin("mturk", turkUniqueId);
          /* eslint-enable */
        } else if (config.USE_PROLIFIC) {
          // TODO: Remove prolific check - we should always check process.env AND UrlSearchParams
          const pID = getProlificId();
          if (config.USE_FIREBASE && pID) {
            setMethod("firebase");
            handleLogin("prolific", pID);
          } else {
            // Error - Prolific must be used with Firebase
            setIsError(true);
          }
        } else if (config.USE_FIREBASE) {
          // TODO: There's a difference between PROLIFIC_ID in URL and PID/SID
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
    }
    setUpHoneycomb();
  }, []);

  /** VALIDATION FUNCTIONS */

  // Default to valid
  const defaultValidation = async () => true;
  // Validate participant/study against Firestore rules
  const firebaseValidation = (studyId, participantId) => {
    return validateParticipant(studyId, participantId);
  };

  /** DATA WRITE FUNCTIONS */

  // Default to no operation
  const defaultFunction = () => {};
  // Add trial data to Firestore
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data);
  };
  // Execute the 'data' callback function (see public/electron.js)
  const desktopUpdateFunction = async (data) => {
    await window.electronAPI.on_data_update(data);
  };
  // Save the trial data to PsiTurk
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data);
  };

  /** EXPERIMENT FINISH FUNCTIONS */

  // Save the experiment data on the desktop
  const defaultFinishFunction = (data) => {
    data.localSave("csv", "neuro-task.csv");
  };
  // Execute the 'end' callback function (see public/electron.js)
  const desktopFinishFunction = async () => {
    await window.electronAPI.on_finish();
  };
  // Complete the PsiTurk experiment
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData({
        success: () => psiturk.completeHIT(),
        error: () => setIsError(true),
      });
    };
    completePsiturk();
  };

  /**
   * Callback function executed when the user logs in.
   *
   * The study and participant IDs are updated and loggedIn is set to true.
   */
  const handleLogin = React.useCallback((studyId, participantId) => {
    setStudyID(studyId);
    setParticipantID(participantId);
    setLoggedIn(true);
  }, []);

  if (isError) {
    return <Error />;
  } else {
    if (loggedIn) {
      return (
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
      );
    } else {
      return (
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
      );
    }
  }
}
