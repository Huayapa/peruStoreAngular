module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
	testPathIgnorePatterns: [
		'<rootDir>/node_modules',
		'.*\\.e2e\\.spec\\.ts$',
		'.*\\.functional\\.spec\\.ts$',
    '<rootDir>/server/'
	],
	transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
}