/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/test/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      statements: 90
    }
  },
  preset: 'ts-jest',
  reporters: [
      'default',
      'jest-junit'
  ],
  roots: [
    'src'
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};