const { openBrowser, goto, closeBrowser, eyes } = require('taiko');
const { taikoEyes } = eyes;

beforeEach(async () => {
  await openBrowser({ headless: true });
});

afterEach(async () => {
  await taikoEyes.close();
  await closeBrowser();
});

after(async () => {
  await taikoEyes.waitForResults();
});

describe('When adding numbers', async () => {
  it('Should return correct result', async () => {
    await goto('https://example.cypress.io/commands/window');
    await taikoEyes.open({
      appName: 'Pass',
      testName: 'Pass!',
    });
    await taikoEyes.checkWindow({
      tag: 'Step1',
    });
    await taikoEyes.checkWindow({
      tag: 'Step1',
    });
  });
});
