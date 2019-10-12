'use strict';

function errorAndDiff(testResultsArr) {
  let failed = [];
  let diffs = [];
  const testResult = JSON.parse(JSON.stringify(testResultsArr));
  if (testResult.status === 'Unresolved') {
    if (testResult.isNew) {
      console.info(`${testResult.name}. Please approve the new baseline at ${testResult.url}`);
      failed.push(testResult);
    } else {
      diffs.push(testResult);
    }
  }
  return { failed, diffs };
}

function errorPerStep(testResultsArr) {
  let failedStep = [];
  let passedStep = [];
  const testResult = JSON.parse(JSON.stringify(testResultsArr));
  const steps = testResult.stepsInfo;
  steps.forEach(step => {
    if (!step.isDifferent) {
      passedStep.push({ name: step.name });
    } else {
      failedStep.push({ name: step.name });
    }
  });
  return { failedStep, passedStep };
}

module.exports = { errorAndDiff, errorPerStep };
