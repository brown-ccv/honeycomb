import PropTypes from "prop-types";
import React from "react";

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
        <form className="centered-h-v" onSubmit={handleSubmit}>
          <label htmlFor="participantID">Participant ID</label>
          <input
            autoFocus
            name="participantID"
            required={true}
            value={participantID}
            onChange={(e) => setParticipantID(e.target.value)}
            className="width-100 form-input"
          />
          <label htmlFor="studyID">Study ID</label>
          <input
            name="studyID"
            required={true}
            value={studyID}
            onChange={(e) => setStudyID(e.target.value)}
            className="width-100 form-input"
          />
          <button className="login-btn width-100" type="submit">
            {isLoading ? "Submitting..." : "Log In"}
          </button>
        </form>
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
