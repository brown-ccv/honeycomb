import React from "react";
import { Button, Form } from "react-bootstrap";

export default function Login({
  handleLogin,
  initialParticipantID,
  initialStudyID,
  validationFunction,
}) {
  // State variables for login screen
  const [participantId, setParticipant] = React.useState(initialParticipantID);
  const [studyId, setStudy] = React.useState(initialStudyID);
  const [isError, setIsError] = React.useState(false);

  // Function used to validate and log in participant
  function handleSubmit(e) {
    e.preventDefault();
    // Logs user in if a valid participant/study id combination is given
    validationFunction(studyId, participantId).then((isValid) => {
      setIsError(!isValid);
      if (isValid) handleLogin(studyId, participantId);
    });
  }

  return (
    <div className="centered-h-v">
      <div className="width-50">
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
            disabled={studyId.length === 0 || participantId.length === 0}
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
