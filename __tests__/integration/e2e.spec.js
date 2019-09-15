const { openBrowser, goto, closeBrowser, eyes } = require('taiko');
const { taikoEyes } = eyes;

jest.setTimeout(30000);

beforeAll(async () => {
  await openBrowser({ headless: false });
});

afterAll(async () => {
  await closeBrowser();
  await taikoEyes.close();
});

test('Should set item in storage', async () => {
  await goto('https://gauge.org/');
  await taikoEyes.open({
    appName: 'Hello World!',
    testName: 'My first JavaScript test!',
  });
  await taikoEyes.checkWindow();
});
