import React from "react";

/**
 * Displays an error message.
 *
 * Note that this error message is only displayed if the task provider has not enabled firebase.
 * @returns A component that displays an error message.
 */
export default function Error() {
  return (
    <div className="centered-h-v">
      <div className="width-50 alert alert-danger">
        Please ask your task provider to enable firebase.
      </div>
    </div>
  );
}
