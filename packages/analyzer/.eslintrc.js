module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  exclude: ['./script.ts'],
}
