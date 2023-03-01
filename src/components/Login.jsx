import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * Handles logic for logging in the user.
 * @param onLogin The function to run when the participant enters a valid particpant and study ID.
 * @param envParticipantId To prefill the participant ID field, if available.
 * @param envStudyId To prefill the study ID field, if available.
 * @param validationFunction The function to use to validate participant ID and study ID.
 * @returns {JSX.Element} The login form.
 */
function Login({ onLogin, envParticipantId, envStudyId, validationFunction }) {
  // TODO: studyId and participantId are handled in App.jsx - pass state hooks as prop?
  const [participantId, setParticipant] = useState(envParticipantId);
  const [studyId, setStudy] = useState(envStudyId);
  const [isError, setIsError] = useState(false);

  // Update the study and participant directly if the environment variables change
  useEffect(() => {
    setParticipant(envParticipantId);
    setStudy(envStudyId);
  }, [envParticipantId, envStudyId]);

  // Verifies both fields have information filled out
  // TODO: Verification with firebase should take place here?
  // TODO: Is it worth doing client validation if we have validation elsewhere?
  function validateForm() {
    return participantId.length > 0 && studyId.length > 0;
  }

  // Handles submission of the form data
  function handleSubmit(e) {
    e.preventDefault();
    validationFunction(participantId, studyId)
    .then((isLoggedIn) => {
      // TODO: Why am I passing isLoggedIn here and checking it? Only need to check in one place
      if (isLoggedIn) onLogin(isLoggedIn, studyId, participantId);
      else setIsError(true);
    });
  }

  return (
    <div className="centered-h-v">
      <div className="width-50">
        {isError ? (
          <div className="alert alert-danger" role="alert">
            The participant ID and study ID do not match
          </div>
        ) : null}
        <Form className="centered-h-v" onSubmit={handleSubmit}>
          <Form.Group className="width-100" size="lg" controlId="participantId">
            <Form.Label>Participant ID</Form.Label>
            <Form.Control
              autoFocus
              // TODO: This isn't a valid type? Should be name?
              type="participantId"
              value={participantId}
              onChange={(e) => setParticipant(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="width-100" size="lg" controlId="studyId">
            <Form.Label>Study ID</Form.Label>
            <Form.Control
              // TODO: This isn't a valid type? Should be name?
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
            // Prevent form submission if both fields aren't filled out
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
