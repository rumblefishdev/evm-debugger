module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
  overrides: [
    {
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
      files: ['src/importedComponents/contentful-ui.types.ts'],
    },
  ],
  extends: ['../../.eslintrc.js'],
}
