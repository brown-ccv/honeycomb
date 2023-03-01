import React, { useState, useEffect, useCallback } from 'react'

import Login from './components/Login'
import JsPsychExperiment from './components/JsPsychExperiment'

import { getProlificId, sleep } from './lib/utils'
import { initParticipant, addToFirebase, addConfigToFirebase } from './firebase'
import { envConfig, taskVersion, turkUniqueId } from './config/main'

// Add styling
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'

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
  // TODO: Add comment about what state variables are

  // TODO: Create (update?) startDate in JSPSychExperiment.jsx 
  // Remember startDate between renders.
  // This is necessary to allow Firebase to create a timestamped document at Login time,
  // and then to find and update the *same* timestamped document after each trial in JsPsychExperiment.
  // const [startDate, setStartDate] = useState(new Date().toISOString())
  const [startDate] = useState(new Date().toISOString())

  // Keep track of if the user is logged in
  const [loggedIn, setLogin] = useState(false)

  // Renderer that allows the frontend to communicate with the Electron
  // TODO: Initialize as empty?
  const [ipcRenderer, setRenderer] = useState(false)
  // Store the Psiturk object
  const [psiturk, setPsiturk] = useState(false)

  // Store study and participant ID pulled from ENV variables
  // TODO: Initialize as null?
  const [envParticipantId, setEnvParticipantId] = useState('')
  const [envStudyId, setEnvStudyId] = useState('')
  
  // Keeps track of which methods are being used ("desktop", "firebase", "mturk", or "default")
  // TODO: Store the method directly?
  const [currentMethod, setMethod] = useState('default')

  // TODO: Use isError like in Login.jsx?
  const [reject, setReject] = useState(false)

  const query = new URLSearchParams(window.location.search)

  /** VALIDATION FUNCTIONS */

  // No validation by default
  const defaultValidation = async () => {
    return true
  }
  // Attempts to initialize the participant in the database
  // firebase.rules ensures participantId and studyId are a valid combination
  // TODO: This should just do validation - don't initialize yet?
  const firebaseValidation = (participantId, studyId) => {
    return initParticipant(participantId, studyId, startDate)
  }

  /** DATA WRITING FUNCTIONS */

 // Do nothing by default
  const defaultFunction = () => {}
  // Write the data to firebase
  // TODO: Don't need this function? Just use addToFirebase?
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data)
  }
  // Tell Electron to save the data (See /public/electron.js)
  const desktopUpdateFunction = (data) => {
    ipcRenderer.send('data', data)
  }
  // Save the trial data using psiturk
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data)
  }

  /** EXPERIMENT FINISH FUNCTIONS */

  // TODO: All of these should be organized the same?

  // Save the data to a local csv file by default
  const defaultFinishFunction = (data) => {
    data.localSave('csv', 'neuro-task.csv')
  }
  // Tell Electron to end (See /public/electron.js)
  const desktopFinishFunction = () => {
    ipcRenderer.send('end', 'true')
  }
  // Save the data to Psiturk and finish its process
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData()
      await sleep(5000)
      psiturk.completeHIT()
    }
    completePsiturk()
  }
  // Save the experiment config and participant used to Firebase
  const firebaseFinishFunction = (data) => {
    addConfigToFirebase(
      data.values()[0].participant_id,
      data.values()[0].study_id,
      data.values()[0].start_date,
      data.config,
    )
  }

  // Function to capture login data, so we can pass it on to JsPsychExperiment.
  // TODO: startDate never changes so this never runs?
  // TODO: We handle logged in user in Login, why here too?
  const setLoggedIn = useCallback(
    (loggedIn,newStudyID, newParticipantID) => {
      if (loggedIn) {
        setEnvStudyId(newStudyID)
        setEnvParticipantId(newParticipantID)
      }
      setLogin(loggedIn)
    },
    [startDate]
  )

  /**
   * This hook runs its effect (the arrow function) one time when App is initialized.
   * Learn about useEffect here: https://reactjs.org/docs/hooks-reference.html#useeffect
  */
  useEffect(() => {
    // Prints the values of the environment variables for testing/debugging purposes.
    console.log("ENV:", envConfig)



    if (envConfig.USE_ELECTRON) {
      // ON DESKTOP
      setMethod('desktop')

      // Get the Electron renderer
      const { ipcRenderer } = window.require('electron')
      setRenderer(ipcRenderer)

      // Update the environment variables in Electron
      ipcRenderer.send('updateEnvironmentVariables', envConfig)
      // If at home, fill in fields based on environment variables

      // Attempt to credentials from Electron
      const credentials = ipcRenderer.sendSync('syncCredentials')
      if (credentials.envParticipantId) setEnvParticipantId(credentials.envParticipantId)
      if (credentials.envStudyId) setEnvStudyId(credentials.envStudyId)
    } else {
      // ON MTURK
      if (envConfig.USE_MTURK) {
        /* eslint-disable */
        // TODO: What's going on with the linter here?
        window.lodash = _.noConflict()
        // Enable PsiTurk and log in with the psiturk credentials
        setPsiturk(new PsiTurk(turkUniqueId, '/complete'))
        setMethod('mturk')
        setLoggedIn(true, 'mturk', turkUniqueId)
        /* eslint-enable */
      } else if (envConfig.USE_PROLIFIC) {
        const pID = getProlificId()
        if (envConfig.USE_FIREBASE && pID) {
          // ON PROLIFIC
          setMethod('firebase')
          // Attempt to login with prolific credentials
          setLoggedIn(true, 'prolific', pID)
        } else {
          // Firebase must be enabled with Prolific - set error
          setReject(true)
        }
      } else if (envConfig.USE_FIREBASE) {
        // ON FIREBASE
        setMethod('firebase')
        // Prefill login form with query parameters
        const participantId = query.get('participantID')
        const studyId = query.get('studyID')
        if (participantId) setEnvParticipantId(participantId)
        if (studyId) setEnvStudyId(studyId)
      } else {
        // Fallback to default method
        setMethod('default')
      }
    }
    // eslint-disable-next-line
  }, [])

  // TODO: Make this a nested ternary
  if (reject) {
    return (
      // TODO: Better error message here
      <div className="centered-h-v">
        <div className="width-50 alert alert-danger">
          Please ask your task provider to enable firebase.
        </div>
      </div>
    )
  } else {
    return (
      <>
        {loggedIn ? (
          <JsPsychExperiment
            participantId={envParticipantId}
            studyId={envStudyId}
            startDate={startDate}
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
      </>
    )
  }
}

export default App
