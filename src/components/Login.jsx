import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/** Login Form
 *
 * This component displays the login Form.
 * It uses the state variables from App.jsx and to validate a user upon submission of the Form
 */
function Login({
  studyID,
  setStudyID,
  participantID,
  setParticipantID,
  handleLogin,
  validationFunction,
}) {
  const [isError, setIsError] = useState(false);

  // Function to log in participant
  function handleSubmit(e) {
    e.preventDefault();
    // Logs user in if a valid participant/study id combination is given
    validationFunction(studyID, participantID).then((isValid) => {
      setIsError(!isValid);
      if (isValid) handleLogin(studyID, participantID);
    });
  }

  return (
    // TODO: Add some vertical spacing between form elements
    <Form className='centered-h-v' onSubmit={handleSubmit}>
      <Form.Group className='width-50' size='lg' controlId='participantId'>
        <Form.Label>Participant ID</Form.Label>
        <Form.Control
          autoFocus
          type='participantId'
          value={participantID}
          onChange={(e) => setParticipantID(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='width-50' size='lg' controlId='studyId'>
        <Form.Label>Study ID</Form.Label>
        <Form.Control type='studyId' value={studyID} onChange={(e) => setStudyID(e.target.value)} />
      </Form.Group>
      <Button
        className='width-50'
        block
        size='lg'
        type='submit'
        disabled={participantID === '' || studyID === ''}
      >
        Log In
      </Button>
      {isError ? (
        <div className='width-50 alert alert-danger' role='alert'>
          No matching experiment found for this participant and study
        </div>
      ) : null}
    </Form>
  );
}

export default Login;
