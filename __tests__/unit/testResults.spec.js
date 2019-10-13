const { TestResults } = require('@applitools/visual-grid-client');
const { errorAndDiff } = require('../../src/errorsAndDiffs');

test('Test Results should have diffs', async () => {
  const result = {
    id: '00000251833307970152',
    name: 'JavaScript test Google !!!',
    secretToken: 'tEShuTI',
    status: 'Unresolved',
    appName: 'First Test Google',
    batchName: 'JavaScript test Google !!!',
    batchId: '00000251833307970420',
    branchName: 'default',
    hostOS: 'Linux',
    hostApp: 'Chrome',
    startedAt: '2019-09-20T15:20:29.401Z',
    duration: 4,
    isNew: false,
    isDifferent: true,
    isAborted: false,
    steps: 1,
    matches: 0,
    mismatches: 1,
    missing: 0,
    exactMatches: 0,
    strictMatches: 0,
    contentMatches: 0,
    layoutMatches: 0,
    noneMatches: 0,
    url: 'https://eyes.applitools.com/app/batches/',
    serverConnector: undefined,
  };

  const testResult = new TestResults(result);
  const diff = errorAndDiff(testResult);
  expect(diff.diffs).toBeInstanceOf(Array);
});
