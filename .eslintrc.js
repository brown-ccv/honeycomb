module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },

  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  plugins: ["react", "prettier"],
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  rules: {
    "react/prop-types": "off",
    "prettier/prettier": "warn",
  },
  overrides: [{ files: ["*.jsx", "*.js"] }],
};
