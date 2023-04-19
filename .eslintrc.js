module.exports = {
  root: true,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: ['react', 'json', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:json/recommended',
    'prettier',
  ],
  rules: {
    'react/prop-types': 'off',
    'prettier/prettier': 1, // Warning
    'json/json': 1, // Warning
  },
  overrides: [
    {
      files: ['*.jsx', '*.js', '*.json'],
    },
  ],
};
