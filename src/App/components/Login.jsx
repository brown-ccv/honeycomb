import PropTypes from "prop-types";
import React from "react";
import { Button, Form } from "react-bootstrap";

export default function Login({
  initialStudyID,
  initialParticipantID,
  validationFunction,
  handleLogin,
}) {
  // State variables for login screen
  const [participantID, setParticipantID] = React.useState(initialParticipantID);
  const [studyID, setStudyID] = React.useState(initialStudyID);

  // State variable for handling errors
  const [isError, setIsError] = React.useState(false);

  // State variable for handling loading states
  const [isLoading, setIsLoading] = React.useState(false);

  // Update local participantID if it changes upstream
  React.useEffect(() => {
    setParticipantID(initialParticipantID);
  }, [initialParticipantID]);

  // Update local studyID if it changes upstream
  React.useEffect(() => {
    setStudyID(initialStudyID);
  }, [initialStudyID]);

  // Function used to validate and log in participant
  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Logs user in if a valid participant/study id combination is given
    validationFunction(studyID, participantID).then((isValid) => {
      setIsLoading(false);
      setIsError(!isValid);
      if (isValid) handleLogin(studyID, participantID);
    });
  }

  return (
    <div className="centered-h-v">
      <div className="width-50">
        <Form className="centered-h-v" onSubmit={handleSubmit}>
          <Form.Group className="width-100" size="lg" controlId="participantID">
            <Form.Label>Participant ID</Form.Label>
            <Form.Control
              autoFocus
              name="participantID"
              required={true}
              value={participantID}
              onChange={(e) => setParticipantID(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="width-100" size="lg" controlId="studyID">
            <Form.Label>Study ID</Form.Label>
            <Form.Control
              name="studyID"
              required={true}
              value={studyID}
              onChange={(e) => setStudyID(e.target.value)}
            />
          </Form.Group>
          <Button style={{ width: "100%" }} block size="lg" type="submit">
            {isLoading ? "Submitting..." : "Log In"}
          </Button>
        </Form>
        {isError ? (
          <div className="alert alert-danger" role="alert">
            Unable to begin the study. Is your login information correct?
          </div>
        ) : null}
      </div>
    </div>
  );
}

Login.propTypes = {
  initialStudyID: PropTypes.string,
  initialParticipantID: PropTypes.string,
  validationFunction: PropTypes.func,
  handleLogin: PropTypes.func,
};
