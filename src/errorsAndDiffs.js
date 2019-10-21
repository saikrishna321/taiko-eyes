export function errorAndDiff(testResultsArr) {
  const failed = [];
  const diffs = [];
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

export function errorPerStep(testResultsArr) {
  const failedStep = [];
  const passedStep = [];
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
