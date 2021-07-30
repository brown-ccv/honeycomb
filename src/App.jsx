import React, { useState, useEffect, useCallback } from "react"

import "./App.css"
import "bootstrap/dist/css/bootstrap.css"
import "@fortawesome/fontawesome-free/css/all.css"

import Login from "./components/Login"
import JsPsychExperiment from "./components/JsPsychExperiment"

import { jsPsych } from "jspsych-react"
import { getTurkUniqueId, getProlificId, sleep } from "./lib/utils"
import { initParticipantFirestore, addToFirebase, addConfigToFirebase } from "./firebase"

import { envConfig } from "./config/main"
import { version } from "../package.json"

/**
 * The top-level React component for Honeycomb. App handles initiating the jsPsych component when the participant
 * successfully logs in, and stores the overall state of the experiment. Importantly, App keeps track of what the
 * experiment is running on (Electron, Firebase, PsiTurk, or MTurk).
 *
 * Note that App is a functional component, which means it uses React callbacks rather than class methods. Learn more
 * about functional vs. class components here: https://reactjs.org/docs/components-and-props.html. It is recommended
 * to use functional components.
 */
function App () {
  const startDate = new Date().toISOString()

  /* State variables. The first variable in the array is the actual state value, the second is the function for updating
  * the value. Calling the update function will trigger a re-render of the component. */

  // Whether the participant has successfully logged in.
  const [loggedIn, setLogin] = useState(false)
  // The renderer that allows the frontend to communicate with the Electron process, when Electron is running.
  const [ipcRenderer, setRenderer] = useState(false)
  // When PsiTurk is used, stores the PsiTurk object.
  const [psiturk, setPsiturk] = useState(false)
  // When available as an environment variable, stores the participant ID.
  const [envParticipantId, setEnvParticipantId] = useState("")
  // When available as an environment variable, stores the study ID.
  const [envStudyId, setEnvStudyId] = useState("")
  const [participantID, setParticipantID] = useState("")
  const [studyID, setStudyID] = useState("")
  // Keeps track of which method is being used ("desktop", "firebase", "mturk", or "default")
  const [currentMethod, setMethod] = useState("default")
  // If the task is set up wrong, reject is set to true.
  const [reject, setReject] = useState(false)

  // If available, gets the participant ID and study ID from the URL.
  const query = new URLSearchParams(window.location.search)

  /* Login validation functions */
  const defaultValidation = async () => {
    return true
  }
  // Attempts to initialize the participant's data on Firebase; the Firebase rules check for a valid participant ID
  // and study ID combination, to validate login.
  const firebaseValidation = (participantId, studyId) => {
    return initParticipantFirestore(participantId, studyId, startDate)
  }

  /* Functions for saving data. */
  // By default, do nothing.
  const defaultFunction = () => {}
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data)
  }
  // Instruct Electron to initiate its data saving process, as defined in /public/electron.js.
  const desktopUpdateFunction = (data) => {
    // ipcRenderer.send will send a message to Electron. See /public/electron.js for details on what happens for each
    // of these events.
    ipcRenderer.send("data", data)
  }
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data)
  }

  /* Functions to run when experiment ends. */
  // By default, save the jsPsych data to a local CSV file in the downloads folder.
  const defaultFinishFunction = () => {
    jsPsych.data.get().localSave("csv", "neuro-task.csv")
  }
  const desktopFinishFunction = () => {
    ipcRenderer.send("end", "true")
  }
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData()
      await sleep(5000)
      psiturk.completeHIT()
    }
    completePsiturk()
  }
  // Firebase saves data after every trial, so at the end of the experiment, it only needs to
  // save the experiment config the participant used.
  const firebaseFinishFunction = (data) => {
    const participantID = data.values()[0].participant_id
    const studyID = data.values()[0].study_id
    const startDate = data.values()[0].start_date
    const config = data.config
    addConfigToFirebase(participantID, studyID, startDate, config)
  }

  /* Logs in a participant. setLoggedIn uses the React hook useCallback, which "memoizes" the function. The function
  * will only change if the startDate state variable changes.  */
  const setLoggedIn = useCallback(
    (loggedIn, newStudyID, newParticipantID) => {
      if (loggedIn) {
        jsPsych.data.addProperties({
          participant_id: newParticipantID,
          study_id: newStudyID,
          start_date: startDate,
          task_version: version
        })
      }
      setParticipantID(newParticipantID)
      setStudyID(newStudyID)
      setLogin(loggedIn)
    },
    [startDate]
  )

  /* This hook runs its effect (the arrow function) one time when App is initialized. Learn about useEffect here:
  * https://reactjs.org/docs/hooks-reference.html#useeffect */
  useEffect(() => {
    // Prints the values of the environment variables for testing/debugging purposes.
    console.log("Environment variable configuration:", envConfig)

    if (envConfig.USE_ELECTRON) {
      const { ipcRenderer } = window.require("electron")
      setRenderer(ipcRenderer)
      ipcRenderer.send("updateEnvironmentVariables", envConfig)
      const credentials = ipcRenderer.sendSync("syncCredentials")
      if (credentials.envParticipantId) {
        setEnvParticipantId(credentials.envParticipantId)
      }
      if (credentials.envStudyId) {
        setEnvStudyId(credentials.envStudyId)
      }
      setMethod("desktop")
    } else {
      if (envConfig.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict()
        const turkId = getTurkUniqueId()
        setPsiturk(new PsiTurk(turkId, "/complete"))
        setMethod("mturk")
        setLoggedIn(true, "mturk", turkId)
        /* eslint-enable */
      } else if (envConfig.USE_PROLIFIC) {
        const pID = getProlificId()
        if (envConfig.USE_FIREBASE && pID) {
          setMethod("firebase")
          setLoggedIn(true, "prolific", pID)
        } else {
          // If using Prolific, Firebase must also be enabled. This shows an error telling the participant to contact
          // the task administrator.
          setReject(true)
        }
      } else if (envConfig.USE_FIREBASE) {
        setMethod("firebase")
        // Prefill login fields with query parameters, if available
        const participantId = query.get("participantID")
        const studyId = query.get("studyID")
        if (participantId) {
          setEnvParticipantId(participantId)
        }
        if (studyId) {
          setEnvStudyId(studyId)
        }
      } else {
        setMethod("default")
      }
    }
    // eslint-disable-next-line
  }, [])

  if (reject) {
    // If Prolific is enabled but Firebase isn't, show this error message.
    return (
      <div className="centered-h-v">
        <div className="width-50 alert alert-danger">
          Please ask your task provider to enable firebase.
        </div>
      </div>
    )
  } else {
    // Ternary (in-line if/else statement) logic for logging in.
    return (
      <>
        {loggedIn ? (
          <JsPsychExperiment
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
                firebase: firebaseFinishFunction,
                default: defaultFinishFunction
              }[currentMethod]
            }
            participantID={participantID}
            studyID={studyID}
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
            envParticipantId={envParticipantId}
            envStudyId={envStudyId}
            onLogin={setLoggedIn}
          />
        )}
      </>
    )
  }
}

export default App
