/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  collectCoverageFrom: ['**/*.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'esbuild-jest',
  },
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: '../coverage',
  coverageProvider: 'v8',
  testMatch: ['**/tests/unit/*.test.ts'],
}
