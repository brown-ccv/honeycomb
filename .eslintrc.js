module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    // TODO: Add rules for import order
    // "plugin:import/errors",
    // "plugin:import/warnings",
    "prettier",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/prop-types": "off",
    "prettier/prettier": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
