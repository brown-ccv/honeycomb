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
    ecmaVersion: 2023,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/prop-types": "off", // TODO: We should provide these?
    "prettier/prettier": "off", // TODO: Remove prettier from eslint
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
