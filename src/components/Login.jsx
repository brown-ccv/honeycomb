import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function Login ({ handleLogin, initialParticipantID, initialStudyID, validationFunction }) {
  // State variables for login screen
  const [participantID, setParticipantID] = useState(initialParticipantID)
  const [studyID, setStudyID] = useState(initialStudyID)
  const [isError, setIsError] = useState(false)

  // Function to log in participant
  function handleSubmit (e) {
    e.preventDefault()
    // Logs user in if a valid participant/study id combination is given
    validationFunction(studyID, participantID).then((isValid) => {
      setIsError(!isValid)
      if (isValid) handleLogin(studyID, participantID)
    })
  }

  return (
    <div className='centered-h-v'>
      <div className='width-50'>
        <Form className='centered-h-v' onSubmit={handleSubmit}>
          <Form.Group className='width-100' size='lg' controlId='participantID'>
            <Form.Label>Participant ID</Form.Label>
            <Form.Control
              autoFocus
              type='participantID'
              value={participantID}
              onChange={(e) => setParticipantID(e.target.value)}
            />
          </Form.Group>
          <Form.Group className='width-100' size='lg' controlId='studyID'>
            <Form.Label>Study ID</Form.Label>
            <Form.Control
              type='studyID'
              value={studyID}
              onChange={(e) => setStudyID(e.target.value)}
            />
          </Form.Group>
          <Button
            style={{ width: '100%' }}
            block
            size='lg'
            type='submit'
            disabled={participantID.length === 0 || studyID.length === 0}
          >
            Log In
          </Button>
        </Form>
        {isError
          ? (
            <div className='alert alert-danger' role='alert'>
              No matching experiment found for this participant and study
            </div>
            )
          : null}
      </div>
    </div>
  )
}

export default Login
