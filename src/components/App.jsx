import React, { useCallback, useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.css'
import '../index.css'

import JsPsychExperiment from './JsPsychExperiment'
import Login from './Login'
import Error from './Error'

import { config, taskVersion, turkUniqueId } from '../config/main'
import { addToFirebase, validateParticipant } from '../firebase'
import { getProlificId } from '../lib/utils'

/**
 * The top-level React component for Honeycomb. App handles initiating the jsPsych component when the participant
 * successfully logs in, and stores the overall state of the experiment. Importantly, App keeps track of what the
 * experiment is running on (Electron, Firebase, PsiTurk, or MTurk).
 */
function App () {
  // Manage user state of the app
  const [loggedIn, setLoggedIn] = useState(false)
  // Manage error state of the app
  const [isError, setIsError] = useState(false)
  // Manage the method state of the app ("desktop", "firebase", "mturk", or "default")
  const [currentMethod, setMethod] = useState('default')

  // Manage the electron renderer
  const [ipcRenderer, setIpcRenderer] = useState()
  // Manage the psiturk object
  const [psiturk, setPsiturk] = useState()

  // Manage user data
  const [participantID, setParticipantID] = useState('')
  const [studyID, setStudyID] = useState('')

  /**
   * This effect is called once, on the first render of the application
   * It uses the environment variables to initialize the above state variables
   */
  useEffect(() => {
    // For testing and debugging purposes
    console.log(config)

    // If on desktop
    if (config.USE_ELECTRON) {
      const { ipcRenderer } = window.require('electron')
      setIpcRenderer(ipcRenderer)

      // TODO: I don't think this is using the ipcRenderer from state? Is that okay?
      ipcRenderer.send('updateEnvironmentVariables', config)
      // Fill in login fields based on environment variables (may still be blank)
      const credentials = ipcRenderer.sendSync('syncCredentials')
      if (credentials.participantID) setParticipantID(credentials.participantID)
      if (credentials.studyID) setStudyID(credentials.studyID)

      setMethod('desktop')
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
        const pID = getProlificId()
        if (config.USE_FIREBASE && pID) {
          setMethod('firebase')
          // TODO 145: Function signature
          handleLogin('prolific', pID)
        } else {
          // Error - Prolific must be used with Firebase
          setIsError(true)
        }
      } else if (config.USE_FIREBASE) {
        // Fill in login fields based on query parameters (may still be blank)
        // TODO: Add explanation about PsiTurk here
        const query = new URLSearchParams(window.location.search)
        const pID = query.get('participantID')
        const sID = query.get('studyID')
        if (pID) setParticipantID(pID)
        if (sID) setStudyID(sID)

        setMethod('firebase')
      } else {
        setMethod('default')
      }
    }
    // eslint-disable-next-line
  }, [])

  /** VALIDATION FUNCTIONS */

  // Note that these arrow functions

  // Default to valid
  const defaultValidation = async () => true
  // Validate participant/study against Firestore rules
  const firebaseValidation = (participantId, studyId) => validateParticipant(participantId, studyId)

  /** DATA WRITE FUNCTIONS */

  // You can read more about arrow functions here: https://www.w3schools.com/js/js_arrow_function.asp

  const defaultFunction = () => {}
  // Add trial data to Firestore
  const firebaseUpdateFunction = (data) => { addToFirebase(data) }
  // Execute the 'data' callback function (see public/electron.js)
  const desktopUpdateFunction = (data) => { ipcRenderer.send('data', data) }
  const psiturkUpdateFunction = (data) => { psiturk.recordTrialData(data) }

  /** EXPERIMENT FINISH FUNCTIONS */

  // Save the experiment data on the desktop
  const defaultFinishFunction = (data) => { data.localSave('csv', 'neuro-task.csv') }
  // Execute the 'end' callback function (see public/electron.js)
  const desktopFinishFunction = () => { ipcRenderer.send('end', 'true') }
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData({
        success: () => psiturk.completeHIT(),
        error: () => setIsError(true)
      })
    }
    completePsiturk()
  }

  // Update the study/participant data when they log in
  const handleLogin = useCallback((participantId, studyId) => {
    setParticipantID(participantId)
    setStudyID(studyId)
    setLoggedIn(true)
  },
  []
  )

  // TODO: Everything should be inside the centered-h-v, don't need to add in Login, JsPsych, etc
  if (isError) { return <Error /> } else {
    return (
      loggedIn
        ? (
          // Logged in - run the experiment
          <JsPsychExperiment
            participantId={participantID}
            studyId={studyID}
            taskVersion={taskVersion}
            dataUpdateFunction={
              {
                desktop: desktopUpdateFunction,
                firebase: firebaseUpdateFunction,
                mturk: psiturkUpdateFunction,
                default: defaultFunction
              }[currentMethod]
            }
            dataFinishFunction={
              {
                desktop: desktopFinishFunction,
                mturk: psiturkFinishFunction,
                firebase: defaultFunction,
                default: defaultFinishFunction
              }[currentMethod]
            }
          />
          )
        : (
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
                firebase: firebaseValidation
              }[currentMethod]
            }
          />
          )
    )
  }
}

export default App
