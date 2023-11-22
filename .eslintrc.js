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
    // TODO: Add rules for import order
    // "plugin:import/errors",
    // "plugin:import/warnings",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2023,
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/prop-types": "off", // TODO: We should provide these?
    "prettier/prettier": "off", // TODO: Remove prettier from eslint
  },
  settings: {
    react: {
      version: "detect", // Eslint detects the react version from package.json when linting
    },
  },
};
