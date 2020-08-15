module.exports = {
  transform: { '^.+\\.ts?$': 'ts-jest' },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json',
    },
  },
};
