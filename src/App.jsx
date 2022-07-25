import React, { useState, useEffect, useCallback } from 'react'

import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'

import Login from './components/Login'
import JsPsychExperiment from './components/JsPsychExperiment'

import { getProlificId, sleep } from './lib/utils'
import { initParticipant, addToFirebase } from './firebase'
import { config, taskVersion, turkUniqueId } from './config/main'

function App () {
  // Remember startDate between renders.
  // This is necessary to allow Firebase to create a timestamped document at Login time,
  // and then to find and update the *same* timestamped document after each trial in JsPsychExperiment.
  const [startDate] = useState(new Date().toISOString())

  // Variables for login
  const [loggedIn, setLogin] = useState(false)
  const [ipcRenderer, setRenderer] = useState(false)
  const [psiturk, setPsiturk] = useState(false)
  const [envParticipantId, setEnvParticipantId] = useState('')
  const [envStudyId, setEnvStudyId] = useState('')
  const [currentMethod, setMethod] = useState('default')
  const [reject, setReject] = useState(false)

  const query = new URLSearchParams(window.location.search)

  // Validation functions for desktop case and firebase
  const defaultValidation = async () => {
    return true
  }
  const firebaseValidation = (participantId, studyId) => {
    return initParticipant(participantId, studyId, startDate)
  }

  // Adding data functions for firebase, electron adn Mturk
  const defaultFunction = () => {}
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data)
  }
  const desktopUpdateFunction = (data) => {
    ipcRenderer.send('data', data)
  }
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data)
  }

  // On finish functions for electron, Mturk
  const defaultFinishFunction = (data) => {
    data.localSave('csv', 'neuro-task.csv')
  }
  const desktopFinishFunction = () => {
    ipcRenderer.send('end', 'true')
  }
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData()
      await sleep(5000)
      psiturk.completeHIT()
    }
    completePsiturk()
  }

  // Function to capture login data, so we can pass it on to JsPsychExperiment.
  const setLoggedIn = useCallback(
    (loggedIn, studyId, participantId) => {
      if (loggedIn) {
        setEnvParticipantId(participantId)
        setEnvStudyId(studyId)
      }
      setLogin(loggedIn)
    },
    [startDate]
  )

  // Login logic
  useEffect(() => {
    // For testing and debugging purposes
    console.log('Turk:', config.USE_MTURK)
    console.log('Firebase:', config.USE_FIREBASE)
    console.log('Prolific:', config.USE_PROLIFIC)
    console.log('Electron:', config.USE_ELECTRON)
    console.log('Video:', config.USE_CAMERA)
    console.log('Volume:', config.USE_VOLUME)
    console.log('Event Marker:', config.USE_EEG)
    console.log('Photodiode:', config.USE_PHOTODIODE)
    // If on desktop
    if (config.USE_ELECTRON) {
      const { ipcRenderer } = window.require('electron')
      setRenderer(ipcRenderer)
      ipcRenderer.send('updateEnvironmentVariables', config)
      // If at home, fill in fields based on environment variables
      const credentials = ipcRenderer.sendSync('syncCredentials')
      if (credentials.envParticipantId) {
        setEnvParticipantId(credentials.envParticipantId)
      }
      if (credentials.envStudyId) {
        setEnvStudyId(credentials.envStudyId)
      }
      setMethod('desktop')
    } else {
      // If MTURK
      if (config.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict()
        setPsiturk(new PsiTurk(turkUniqueId, '/complete'))
        setMethod('mturk')
        setLoggedIn(true, 'mturk', turkUniqueId)
        /* eslint-enable */
      } else if (config.USE_PROLIFIC) {
        const pID = getProlificId()
        if (config.USE_FIREBASE && pID) {
          setMethod('firebase')
          setLoggedIn(true, 'prolific', pID)
        } else {
          setReject(true)
        }
      } else if (config.USE_FIREBASE) {
        setMethod('firebase')
        // Autologin with query parameters
        const participantId = query.get('participantID')
        const studyId = query.get('studyID')
        if (participantId) {
          setEnvParticipantId(participantId)
        }
        if (studyId) {
          setEnvStudyId(studyId)
        }
      } else {
        setMethod('default')
      }
    }
    // eslint-disable-next-line
  }, [])

  if (reject) {
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
