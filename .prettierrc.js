/**
 * This file defines specific rules for Prettier. It adjusts their default settings.
 * The CCV recommends these settings if your lab does not have specific style standards.
 */
module.exports = {
  trailingComma: "es5", // Add a trailing comma to all es5 modules
  printWidth: 100, // Sets the maximum line size to 100 (default is 80)
  endOfLine: "auto", // Configure the end of line character (/n) | REQUIRED FOR OS COMPATIBILITY
};
