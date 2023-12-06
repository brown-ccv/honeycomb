/**
 * This file defines specific rules for Prettier. It adjusts their default settings.
 * We recommend these settings if your lab does not have specific style standards.
 */
module.exports = {
  printWidth: 100, // Sets the maximum line size to 100 (default is 80)
  quoteProps: "as-needed", // Add quotes around props as needed
  trailingComma: "es5", // Add a trailing comma to all es5 modules
  overrides: [
    {
      // Treats .firebaserc as a json file
      files: ".firebaserc",
      options: { parser: "json" },
    },
  ],
};
