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
  },
  settings: {
    react: {
      version: "detect",
    },
    jsdoc: {
      tagNamePreference: {
        typedef: {
          definedInFiles: ["src/lib/typedefs.js"],
        },
      },
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
  overrides: [{ files: ["*.jsx", "*.js"] }],
};
