module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],
  setupFiles: [
    '<rootDir>/setup-jest-dependencies.ts'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/test.ts'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/global-mocks.ts',
    '<rootDir>/src/configurations/',
    '<rootDir>/src/tests/',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/polyfills.ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        '<rootDir>/node_modules/jest-preset-angular/build/StripStylesTransformer',
        '<rootDir>/node_modules/jest-preset-angular/build/InlineFilesTransformer'
      ]
    }
  },
  coverageThreshold: {
    global: {
      statements: 80
    }
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@configurations': '<rootDir>/src/configurations/configuration',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1'
  }
};
