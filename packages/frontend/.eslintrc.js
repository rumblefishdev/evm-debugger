module.exports = {
  extends: ['../../.eslintrc.js',
    "plugin:react/recommended",],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
  rules: {
    'sonarjs/cognitive-complexity': 'off',

    //React
    "react/react-in-jsx-scope": "off",
    "react/jsx-first-prop-new-line": [2, "multiline"],
    // "import/no-cycle": "off"
  },
  overrides: [
    {
      files: ['src/importedComponents/contentful-ui.types.ts'],
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
    },
  ],
}
