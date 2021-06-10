module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'eslint:recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // is rules
    'strict': [
      2,
      'function'
    ],
    'camelcase': 0,
    'no-bitwise': 0,
    'curly': 2,
    'eqeqeq': [2, 'smart'],
    'guard-for-in': 2,
    'wrap-iife': [
      2,
      'any'
    ],
    'no-empty': 2,
    'no-use-before-define': 0,
    'new-cap': 2,
    'no-caller': 2,
    'no-undef': 2,
    'no-new': 2,
    'no-eq-null': 0,
    'linebreak-style': 2,
    'dot-notation': 0,
    'semi': [2, 'always'],
    'object-curly-spacing': ['error', 'always'],
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'no-trailing-spaces': [2, { 'skipBlankLines': true }]
  }
}
