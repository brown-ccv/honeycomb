/**
 * This file defines specific rules for Prettier. It adjusts their default settings
 */
module.exports = {
  trailingComma: 'es5', // Add a trailing comma to all es5 modules
  singleQuote: true, // Use single quote (') for strings instead of doubles ("")
  jsxSingleQuote: true, // Use single quote (') for strings instead of doubles ("") in JSX files
  printWidth: 100, // Sets the maximum line size to 100 (default is 80)
  endOfLine: 'auto', // Configure the end of line character (/n) | REQUIRED FOR OS COMPATIBILITY
};
