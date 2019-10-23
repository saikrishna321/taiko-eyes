/* eslint-disable import/prefer-default-export */

// All utility functions can move here
export function containsTestFailure(testsResults) {
  return testsResults.some(testResult => testResult.some(r => r.getStatus() !== 'Passed'));
}
