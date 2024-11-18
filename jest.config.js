/** @type {import('jest').Config} */
const config = {
    verbose: true,
    collectCoverage: true,
    reporters: [
        'summary',
        'jest-silent-reporter',
        ['github-actions', {silent: false}],
        ['jest-junit', {outputDirectory: 'test-results'}]
    ],
    coverageReporters: ["json", "text"]
};

module.exports = config;