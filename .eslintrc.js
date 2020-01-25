/**
 * @module eslintrc
 */

// Configure rules.
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    _: true,
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {}
}
