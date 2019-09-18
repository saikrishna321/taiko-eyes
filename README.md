# taiko-eyes ‼️ Not ready for production

[![Build Status](https://dev.azure.com/saikrishna321/taiko-eyes/_apis/build/status/saikrishna321.taiko-eyes?branchName=master)](https://dev.azure.com/saikrishna321/taiko-eyes/_build/latest?definitionId=6&branchName=master)

[![codecov](https://codecov.io/gh/saikrishna321/taiko-eyes/branch/master/graph/badge.svg)](https://codecov.io/gh/saikrishna321/taiko-eyes)

<h1 align="center">
	<br>
	<img src="images/taiko-eyes.png" alt="TaikoEyes">
	<br>
	<br>
	<br>
</h1>



### Applitools API key

In order to authenticate via the Applitools server, you need to supply the Taiko-Eyes SDK with the API key you got from Applitools. Read more about how to obtain the API key [here](https://applitools.com/docs/topics/overview/obtain-api-key.html).

To to this, set the environment variable `APPLITOOLS_API_KEY` to the API key before running your tests.
For example, on Linux/Mac:

```bash
export APPLITOOLS_API_KEY=<your_key>
```

And on Windows:

```bash
set APPLITOOLS_API_KEY=<your_key>
```

It's also possible to specify the API key in the `fixtures/applitools.config.js` file. The property name is `apiKey`. For example:

```js
module.exports = {
  apiKey: 'YOUR_API_KEY',
  ...
}
```

### Example

```js
const { openBrowser, goto, closeBrowser, eyes } = require('taiko');
const { taikoEyes } = eyes;

jest.setTimeout(130000);

before(async () => {	
  await openBrowser();
  await taikoEyes.open({
    appName: 'Taiko Eyes!',
    testName: 'Taiko Visual Test!',
  });
});

after(async () => {
  await taikoEyes.close();
  await closeBrowser();
});

test('Should set item in storage', async () => {
  await goto('https://gauge.org/');
  await taikoEyes.checkWindow();
});

```

### Best practice for using the SDK

Every call to `taikoEyes.open` and `taikoEyes.close` defines a test in Applitools Eyes, and all the calls to `taikoEyes.checkWindow` between them are called "steps". In order to get a test structure in Applitools that corresponds to the test structure in taiko, it's best to open/close tests in every `it` call. This can be done via the `beforeEach` and `afterEach`.

### Commands

#### Open

Create an Applitools test.
This will start a session with the Applitools server.

```js
taikoEyes.open({
  appName: '',
  testName: ''
});
```

#### Check window

Generate a screenshot of the current page and add it to the Applitools Test.

```js
taikoEyes.checkWindow();
```

#### Close

Close the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `eyesOpen`(or in `afterEach()`
Close receives no arguments.

```js
await taikoEyes.close();
```