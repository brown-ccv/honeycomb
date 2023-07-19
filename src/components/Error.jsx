import React from "react";

/** Error
 * This is a basic JSX component for displaying an error
 * By using a separate file the code in App.jsx is easier to read
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
