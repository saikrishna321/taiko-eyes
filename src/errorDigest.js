'use strict';
const chalk = require('chalk');

function errorDigest({ failed, diffs, failedStep, passedStep }) {
  const testLink = diffs.length ? `\n\n${indent(2)}See details at: ${diffs[0].url}` : '';

  return `Eyes-taiko detected diffs or errors during execution of visual tests:
${indent(2)}${chalk.red(`Diffs detected - ${diffs.length} tests`)}${testResultsToString(diffs)}
${indent(2)}${chalk.red(`Errors - ${failed.length} tests`)}${testResultsToString(failed)}${testLink}
${indent(2)}${chalk.green(`Passed - ${passedStep.length} steps`)}${testResultsToString(passedStep, true)}
${indent(2)}${chalk.red(`Failed - ${failedStep.length} steps`)}${testResultsToString(failedStep)}`;
}

function stringifyTestResults(testResults) {
  return `${testResults.name}${testResults.error ? ` : ${testResults.error}` : ''}`;
}

function stringifyError(error) {
  return `[Eyes Error] : ${error}`;
}

function testResultsToString(testResultsArr, isGood) {
  return testResultsArr.length
    ? `\n${indent(3)}${testResultsArr
        .map(
          testResults =>
            `${isGood ? chalk.green('\u2713') : chalk.red('\u2716')} ${chalk.reset(
              testResults instanceof Error ? stringifyError(testResults) : stringifyTestResults(testResults),
            )}`,
        )
        .join(`\n${indent(3)}`)}`
    : '';
}

function indent(count) {
  return `   ${'  '.repeat(count)}`;
}

module.exports = errorDigest;
