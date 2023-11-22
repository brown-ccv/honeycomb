module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    // TODO 325: Add rules for import order
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2023,
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": "off", // TODO: These should be added so the rule can be removed
  },
  settings: {
    react: {
      version: "detect", // Eslint detects the react version from package.json when linting
    },
  },
};
