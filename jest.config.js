const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Ignore E2E tests folder for Jest unit tests
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
}

module.exports = createJestConfig(customJestConfig)
