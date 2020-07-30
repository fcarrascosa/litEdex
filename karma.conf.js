/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        {
          pattern: config.grep ? config.grep : 'test/**/*.test.js',
          type: 'module',
        },
        {
          pattern: config.grep ? config.grep : 'src/**/test/*.test.js',
          type: 'module',
        },
      ],

      esm: {
        nodeResolve: true,
      },
      // you can overwrite/extend the config further

      plugins: ['karma-junit-reporter'],
      reporters: ['junit'],
      frameworks: ['mocha', 'sinon-chai'],
      junitReporter: {
        outputFile: 'test-results.xml',
        outputDir: 'coverage',
        useBrowserName: false,
      },
      coverageIstanbulReporter: {
        reports: ['html', 'lcovonly', 'text-summary', 'cobertura'],
        dir: 'coverage',
        combineBrowserReports: true,
        skipFilesWithNoCoverage: false,
        thresholds: {
          global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
          },
        },
      },
    })
  );
  return config;
};
