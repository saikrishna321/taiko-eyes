'use strict';

function errorAndDiff(testResultsArr) {
  return testResultsArr.reduce(
    ({ failed, diffs }, testResults) => {
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
      }
      return { failed, diffs };
    },
    {
      failed: [],
      diffs: [],
    },
  );
}

function errorPerStep(testResultsArr) {
  return testResultsArr.reduce(
    ({ failedStep, passedStep }, testResults) => {
      const testResult = JSON.parse(JSON.stringify(testResults._testResults));
      const steps = testResult.stepsInfo;
      steps.forEach(step => {
        if (!step.isDifferent) {
          passedStep.push({ name: step.name });
        } else {
          failedStep.push({ name: step.name });
        }
      });
      return { failedStep, passedStep };
    },
    {
      failedStep: [],
      passedStep: [],
    },
  );
}

module.exports = { errorAndDiff, errorPerStep };
