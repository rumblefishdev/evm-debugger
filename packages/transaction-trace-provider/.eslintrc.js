module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      rules: {
        'no-use-before-define': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
      files: ['src/importedComponents/contentful-ui.types.ts'],
    },
  ],
}
