module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.json', diagnostics: false },
    ],
  },
  moduleNameMapper: {
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^@prisma/generated/(.*)$': '<rootDir>/src/generated/prisma/$1',
    '^@prisma/generated$': '<rootDir>/src/generated/prisma',
  },
  transformIgnorePatterns: ['/node_modules/(?!(graphql-upload|uuid)/)'],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
};
