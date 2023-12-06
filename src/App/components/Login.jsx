import React, { useEffect } from "react";
import { Button, Form } from "react-bootstrap";

export default function Login({
  handleLogin,
  initialParticipantID,
  initialStudyID,
  validationFunction,
}) {
  // State variables for login screen
  const [participantID, setParticipantID] = React.useState(initialParticipantID);
  const [studyID, setStudyID] = React.useState(initialStudyID);
  const [isError, setIsError] = React.useState(false);

  // Update local participantID if it changes upstream
  useEffect(() => {
    setParticipantID(initialParticipantID);
  }, [initialParticipantID]);

  // Update local studyID if it changes upstream
  useEffect(() => {
    setStudyID(initialStudyID);
  }, [initialStudyID]);

  // Function used to validate and log in participant
  function handleSubmit(e) {
    e.preventDefault();
    // Logs user in if a valid participant/study id combination is given
    validationFunction(studyID, participantID).then((isValid) => {
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
              type="participantID"
              value={participantID}
              onChange={(e) => setParticipantID(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="width-100" size="lg" controlId="studyID">
            <Form.Label>Study ID</Form.Label>
            <Form.Control
              type="studyID"
              value={studyID}
              onChange={(e) => setStudyID(e.target.value)}
            />
          </Form.Group>
          <Button
            style={{ width: "100%" }}
            block
            size="lg"
            type="submit"
            disabled={studyID.length === 0 || participantID.length === 0}
          >
            Log In
          </Button>
        </Form>
        {isError ? (
          <div className="alert alert-danger" role="alert">
            No matching experiment found for this participant and study
          </div>
        ) : null}
      </div>
    </div>
  );
}
