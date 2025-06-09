// eslint.config.js
"use strict";

const globals = require("globals");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Adicione ou modifique regras conforme necessário
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  }
];