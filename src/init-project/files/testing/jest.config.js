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
    '<rootDir>/src/test.ts',
    '<rootDir>/global-mocks.ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        '<rootDir>/node_modules/jest-preset-angular/build/StripStylesTransformer',
        '<rootDir>/node_modules/jest-preset-angular/build/InlineFilesTransformer'
      ],
      
    }
  },
  "coverageThreshold": {
    "global": {
      "statements": 70
    }
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@configurations': '<rootDir>/src/configurations/configuration',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1'
  }
};
