import React, { useState, useEffect, useCallback } from 'react'

import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { getTurkUniqueId, getProlificId, sleep } from "./lib/utils"
import { initParticipantFirestore, addToFirebase, addConfigToFirebase } from "./firebase"
import { envConfig } from "./config/main"

import Login from './components/Login'
import JsPsychExperiment from './components/JsPsychExperiment'

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
  /** State hooks
   * The first variable in the array is the value stored in React's state
   * The second is the function for updating the value. Calling it will trigger a re-render of the component.
   * More info here: https://reactjs.org/docs/hooks-state.html
  */
  // Remember startDate between renders.
  // This is necessary to allow Firebase to create a timestamped document at Login time,
  // and then to find and update the *same* timestamped document after each trial in JsPsychExperiment.
  // TODO 128: Update after login
  const [startDate] = useState(new Date().toISOString())
  // Whether the participant has successfully logged in.
  const [loggedIn, setLogin] = useState(false)
  // Renderer that allows the frontend to communicate with the Electron process
  const [ipcRenderer, setRenderer] = useState(false)
  // PsiTurk object
  const [psiturk, setPsiturk] = useState(false)
  // TODO: Combine env and normal state vars?
  // Stores the participant ID from an environment variable
  const [envParticipantId, setEnvParticipantId] = useState("")
  // Stores the study ID from an environment variable
  const [envStudyId, setEnvStudyId] = useState("")
  const [participantID, setParticipantID] = useState("")
  const [studyID, setStudyID] = useState("")

  // Keeps track of method to use ("desktop", "firebase", "mturk", or "default")
  // TODO: Store the functions directly here
  const [currentMethod, setMethod] = useState('default')
  // Reject task if it's set up incorrectly
  const [reject, setReject] = useState(false)

  // Get the search quey from the URL - may include participant ID and/or study ID 
  const query = new URLSearchParams(window.location.search)

  /** LOGIN VALIDATION FUNCTIONS */

  // Validation functions for desktop case and firebase
  const defaultValidation = async () =>
    // Default to valid
    true
  const firebaseValidation = (participantId, studyId) => 
    // Attempt to initialize data in Firestore, verifies a valid participant/study combination
    initParticipantFirestore(participantId, studyId, startDate)
  
  /** DATA WRITE FUNCTIONS */

  // Adding data functions for firebase, electron adn Mturk
  const defaultFunction = () => 
    // Do nothing by default
    {}
  const firebaseUpdateFunction = (data) =>
    addToFirebase(data)
  const desktopUpdateFunction = (data) => 
    // Emit the "data" event, see /public/electron.js
    ipcRenderer.send('data', data)
  const psiturkUpdateFunction = (data) => 
    psiturk.recordTrialData(data)
  

  /** EXPERIMENT FINISH FUNCTIONS */

  const defaultFinishFunction = (data) => 
    // Save local csv file by default (/Desktop)
    // TODO: Default to Firebase emulators?
    // TODO: Better naming of the file
    data.localSave('csv', 'neuro-task.csv')
  const desktopFinishFunction = () =>
    // Emit the "end" event, see /public/electron.js
    ipcRenderer.send('end', 'true')
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData()
      await sleep(5000)
      psiturk.completeHIT()
    }
    completePsiturk()
  }
  const firebaseFinishFunction = (data) => {
    // Firebase saves data per trial, store experiment config used
    addConfigToFirebase(
      data.values()[0].participant_id,
      data.values()[0].study_id,
      data.values()[0].start_date,
      data.config
    )
  }

  /**
   * Callback function to capture login data 
   * More info here: https://reactjs.org/docs/hooks-reference.html#usecallback
   */
  // TODO: Update startDate here
  // TODO: Never runs because startData never changes?
  const setLoggedIn = useCallback(
    (loggedIn, newStudyID, newParticipantID) => {
      if (loggedIn) {
        setParticipantID(newParticipantID)
        setStudyID(newStudyID)
      }
      setLogin(loggedIn)
    },
    [startDate]
  )

  /**
   * This hook runs its effect (the arrow function) one time when App is initialized.
   * More info here: https://reactjs.org/docs/hooks-reference.html#useeffect
  */
  useEffect(() => {
    // Prints the values of the environment variables for testing/debugging purposes.
    console.log("Environment variable configuration:", envConfig)

    // TODO: Clean up logic here - shouldn't have to be nested?
    if (envConfig.USE_ELECTRON) {
      // USING ELECTRON
      const { ipcRenderer } = window.require('electron')
      setRenderer(ipcRenderer)
      ipcRenderer.send('updateEnvironmentVariables', envConfig)
      // Fill login fields based on environment variables
      const credentials = ipcRenderer.sendSync('syncCredentials')
      if (credentials.envParticipantId) setEnvParticipantId(credentials.envParticipantId)
      if (credentials.envStudyId) setEnvStudyId(credentials.envStudyId)
      setMethod('desktop')
    } else {
      if (envConfig.USE_MTURK) {
        // TODO: Why the eslint disable? What's going on here?
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
          setMethod('firebase')
          setLoggedIn(true, 'prolific', pID)
        } else {
          // PROLIFIC must use firebase - invalid setup
          setReject(true)
        }
      } else if (envConfig.USE_FIREBASE) {
        setMethod('firebase')
        // Prefill login fields with query parameters, if available
        const participantId = query.get('participantID')
        const studyId = query.get('studyID')
        if (participantId) setEnvParticipantId(participantId)
        if (studyId) setEnvStudyId(studyId)
      } else {
        // Default fallback
        setMethod('default')
      }
    }
    // eslint-disable-next-line
  }, [])

  // TODO: Refactor into ternary
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
    return loggedIn ? (
      <JsPsychExperiment
        participantID={participantID}
        studyID={studyID}
        startDate={startDate}
        // taskVersion={taskVersion}
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
}

export default App
