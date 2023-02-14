import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * Handles login logic.
 * @param onLogin The function to run when the participant enters a valid particpant and study ID.
 * @param envParticipantId To prefill the participant ID field, if available.
 * @param envStudyId To prefill the study ID field, if available.
 * @param validationFunction The function to use to validate participant ID and study ID.
 * @returns {JSX.Element} The login form.
 */
function Login({ onLogin, envParticipantId, envStudyId, validationFunction }) {
  /* State variables for login screen */
  const [participantId, setParticipant] = useState("");
  const [studyId, setStudy] = useState("");
  const [error, setError] = useState(false);

  /* Runs every time envParticipantId and envStudyId change. */
  useEffect(() => {
    setParticipant(envParticipantId);
    setStudy(envStudyId);
  }, [envParticipantId, envStudyId]);

  /* Verifies that both fields have been filled out. */
  function validateForm() {
    return participantId.length > 0 && studyId.length > 0;
  }

  /* Handles submitting the form. */
  function handleSubmit(e) {
    e.preventDefault();
    // Validates fields
    validationFunction(participantId, studyId)
    // Logs in depending on result from promise
    .then((loggedIn) => {
      if (loggedIn) {
        onLogin(loggedIn, studyId, participantId);
      } else {
        setError(true);
      }
    });
  }

  return (
    <div className="centered-h-v">
      <div className="width-50">
        {error ? (
          <div className="alert alert-danger" role="alert">
            The participant ID and study ID do not match
          </div>
        ) : null}
        <Form className="centered-h-v" onSubmit={handleSubmit}>
          <Form.Group className="width-100" size="lg" controlId="participantId">
            <Form.Label>Participant ID</Form.Label>
            <Form.Control
              autoFocus
              type="participantId"
              value={participantId}
              onChange={(e) => setParticipant(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="width-100" size="lg" controlId="studyId">
            <Form.Label>Study ID</Form.Label>
            <Form.Control
              type="studyId"
              value={studyId}
              onChange={(e) => setStudy(e.target.value)}
            />
          </Form.Group>
          <Button
            style={{ width: "100%" }}
            block
            size="lg"
            type="submit"
            disabled={!validateForm()}
          >
            Log In
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
