import React, { useState, useEffect, useCallback } from 'react'

import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'

import Login from './components/Login'
import JsPsychExperiment from './components/JsPsychExperiment'

import { jsPsych } from 'jspsych-react'
import { getTurkUniqueId, getProlificId, sleep } from './lib/utils'
import { initParticipant, addToFirebase, addConfigToFirebase } from "./firebase"

import { envConfig } from './config/main'
import { version } from '../package.json'

function App () {
  // Variables for time
  const startDate = new Date().toISOString()
  // Variables for login
  const [loggedIn, setLogin] = useState(false)
  const [ipcRenderer, setRenderer] = useState(false)
  const [psiturk, setPsiturk] = useState(false)
  const [envParticipantId, setEnvParticipantId] = useState('')
  const [envStudyId, setEnvStudyId] = useState('')
  const [participantID, setParticipantID] = useState("")
  const [studyID, setStudyID] = useState("")
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
  const defaultFinishFunction = () => {
    jsPsych.data.get().localSave('csv', 'neuro-task.csv')
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
  const firebaseFinishFunction = (data) => {
    const participantID = data.values()[0].participant_id
    const studyID = data.values()[0].study_id
    const startDate = data.values()[0].start_date
    const config = data.config
    addConfigToFirebase(participantID, studyID, startDate, config)
  }

  // Function to add jspsych data on login
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

  // Login logic
  useEffect(() => {
    // For testing and debugging purposes
    console.log("Environment variable configuration:", envConfig)
    // If on desktop
    if (envConfig.USE_ELECTRON) {
      const { ipcRenderer } = window.require('electron')
      setRenderer(ipcRenderer)
      ipcRenderer.send('updateEnvironmentVariables', envConfig)
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
      if (envConfig.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict()
        const turkId = getTurkUniqueId()
        setPsiturk(new PsiTurk(turkId, '/complete'))
        setMethod('mturk')
        setLoggedIn(true, 'mturk', turkId)
        /* eslint-enable */
      } else if (envConfig.USE_PROLIFIC) {
        const pID = getProlificId()
        if (envConfig.USE_FIREBASE && pID) {
          setMethod('firebase')
          setLoggedIn(true, 'prolific', pID)
        } else {
          setReject(true)
        }
      } else if (envConfig.USE_FIREBASE) {
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
