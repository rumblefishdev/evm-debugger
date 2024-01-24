module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:react/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
  rules: {
    'sonarjs/cognitive-complexity': 'off',

    //React
    'react/react-in-jsx-scope': 'off',
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/prop-types': 'off',
    'react/display-name': 'off',
    // "import/no-cycle": "off"
  },
}
