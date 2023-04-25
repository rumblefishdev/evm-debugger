module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
  rules: {
    'sonarjs/cognitive-complexity': 'off',
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
