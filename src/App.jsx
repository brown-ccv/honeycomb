import React, { useCallback, useEffect, useState } from 'react'

import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

import JsPsychExperiment from './components/JsPsychExperiment'
import Login from './components/Login'

import { config, taskVersion, turkUniqueId } from './config/main'
import { addToFirebase, validateParticipant } from './firebase'
import { getProlificId, sleep } from './lib/utils'

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
  // Manage if a user is currently logged in
  const [loggedIn, setLoggedIn] = useState(false)
  // Manage error state of the app
  const [isError, setIsError] = useState(false)

  // Manage the electron renderer
  const [ipcRenderer, setIpcRenderer] = useState()
  // Manage the psiturk object
  const [psiturk, setPsiturk] = useState(false)

  // Manage the data used in the experiment
  const [participantID, setParticipantID] = useState('')
  const [studyID, setStudyID] = useState('')
  // Remember startDate between renders.
  // This is necessary to allow Firebase to create a timestamped document at Login time,
  // and then to find and update the *same* timestamped document after each trial in JsPsychExperiment.
  // TODO: Shouldn't the document have a UID? Save the date but we should have a uid for the document?
  const [startDate, setStartDate] = useState(new Date().toISOString())

  // Manage the method type being used ("desktop", "firebase", "mturk", or "default")
  const [currentMethod, setMethod] = useState('default')

  /**
   * This effect is called once, on the first render of the application
   * It checks the environment variables to initialize needed state variables
   * And determines which methods to be using
   */
  // TODO: Electron shouldn't be mutually exclusive?
  useEffect(() => {
    // For testing and debugging purposes
    console.log(config)

    // If on desktop
    if (config.USE_ELECTRON) {
      const { ipcRenderer } = window.require('electron')
      setIpcRenderer(ipcRenderer)

      // TODO: I don't think this is using the ipcRenderer from state?
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
        // TODO: This won't work
        handleLogin('mturk', turkUniqueId)
        /* eslint-enable */
      } else if (config.USE_PROLIFIC) {
        const pID = getProlificId()
        if (config.USE_FIREBASE && pID) {
          setMethod('firebase')
          // TODO: This wont work
          handleLogin('prolific', pID)
        } else {
          // Error - Prolific must be used with Firebase
          setIsError(true)
        }
      } else if (config.USE_FIREBASE) { 
        // Fill in login fields based on query parameters (may still be blank)
        const query = new URLSearchParams(window.location.search)
        const participantId = query.get('participantID')
        const studyId = query.get('studyID')
        if (participantId) setParticipantID(participantId)
        if (studyId) setStudyID(studyId)

        setMethod('firebase')
      } else {
        setMethod('default')
      }
    }
    console.log(currentMethod)
    // eslint-disable-next-line
  }, [])

  

  /** VALIDATION FUNCTIONS */

  // Default to valid
  const defaultValidation = async () => true

  // TODO: This should JUST validate, not init the participant
  // Validate participant/study against firestore rules
  const firebaseValidation = (participantId, studyId) => {
    // return initParticipant(participantId, studyId, startDate)
    return validateParticipant(participantId, studyId)
  }

  /** DATA WRITE FUNCTIONS */

  // Adding data functions for firebase, electron adn Mturk
  const defaultFunction = () => {}
  const firebaseUpdateFunction = (data) => { addToFirebase(data) }
  const desktopUpdateFunction = (data) => { ipcRenderer.send('data', data) }
  const psiturkUpdateFunction = (data) => { psiturk.recordTrialData(data) }

  /** EXPERIMENT FINISH FUNCTIONS */

  const defaultFinishFunction = (data) => { data.localSave('csv', 'neuro-task.csv') }
  const desktopFinishFunction = () => { ipcRenderer.send('end', 'true') }
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData()
      await sleep(5000)
      psiturk.completeHIT()
    }
    completePsiturk()
  }

  // Update the study/participant data when they log in
  const handleLogin = useCallback((participantId, studyId) => {
      const loginDate = new Date().toISOString()
      setParticipantID(participantId)
      setStudyID(studyId)
      setStartDate(loginDate)
      setLoggedIn(true)
    },
    []
  )

  if (isError) {
    return (
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
            participantId={participantID}
            studyId={studyID}
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
                firebase: defaultFunction,
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
            initialParticipantID={participantID}
            initialStudyID={studyID}
            handleLogin={handleLogin}
          />
        )}
      </>
    )
  }
}

export default App
