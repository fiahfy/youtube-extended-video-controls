module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    chrome: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'
  ]
}
