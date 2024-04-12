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
    "plugin:import/recommended",
    "prettier",
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2023,
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": "warn",
    "import/order": "warn",
    // Codespace rules
    "no-constant-condition": "warn",
    "no-unreachable": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  overrides: [{ files: ["*.jsx", "*.js"] }],
};
