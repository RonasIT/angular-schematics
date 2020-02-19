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
    '/cache/'
  ],
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverageFrom: [
    '<rootDir>/src/app/**/*.{ts,html}'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/global-mocks.ts',
    '<rootDir>/src/configurations/',
    '<rootDir>/src/tests/',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/polyfills.ts',
    '<rootDir>/src/app/shared/store/state.ts',
    '<rootDir>/src/app/(.*).module.ts',
    '<rootDir>/src/app/(.*).routing.ts',
    '<rootDir>/src/app/(.*).error-handler.ts',
    '<rootDir>/src/app/(.*).translate.loader.ts',
    '<rootDir>/src/app/(.*)/shared/forms/(.*).ts',
    '<rootDir>/src/app/(.*)/index.ts'
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
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@configurations': '<rootDir>/src/configurations/configuration',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1'
  }
};
