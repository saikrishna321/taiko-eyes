'use strict';

function errorsAndDiffs(testResultsArr) {
  return testResultsArr.reduce(
    ({ failed, diffs, passed }, testResults) => {
      const testResult = JSON.parse(JSON.stringify(testResults._testResults));
      if (testResults instanceof Error) {
        failed.push(testResults);
      }
      if (testResult.status === 'Unresolved') {
        if (testResult.isNew) {
          console.info(`${testResult.name}. Please approve the new baseline at ${testResult.url}`);
          failed.push(testResults);
        } else {
          diffs.push(testResults);
        }
      } else if (testResult.status === 'Failed') {
        failed.push(testResults);
      } else {
        passed.push(testResults);
      }

      return { failed, diffs, passed };
    },
    {
      failed: [],
      diffs: [],
      passed: [],
    },
  );
}

module.exports = errorsAndDiffs;
