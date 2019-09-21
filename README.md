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

##### Arguments to `taikoEyes.checkWindow`

* ##### `tag` 
  (optional): A logical name for this check.

* ##### `target`
  (optional): Possible values are:
  <br/> 1. `window` 
    This is the default value. If set then the captured image is of the entire page or the viewport, use [`fully`](#fully) for specifying what `window` mode to use.
  <br/>2. `region` 
    If set then the captured image is of the parts of the page, use this parameter with [`region`](#region) or [`selector`](#selector) for specifying the areas to captured.

* ##### `fully`
  (optional) In case [`target`](#target) is `window`, if `fully` is `true` (default) then the snapshot is of the entire page, if `fully` is `false` then snapshot is of the viewport.

  ```js
    // Capture viewport only
    taikoEyes.checkWindow({
      target: 'window',
      fully: false,
    });
    ```

* ##### `selector`
  (optional): In case [`target`](#target) is `region`, this should be the actual css or xpath selector to an element, and the screenshot would be the content of that element. For example:

    ```js
    Using a css selector
    taikoEyes.checkWindow({
      target: 'region',
      selector: {
        type: 'css',
        selector: '.element-to-locate'
      }
    });
    
    Using an xpath selector
    taikoEyes.checkWindow({
      target: 'region',
      selector: {
        type: 'xpath',
        selector: '//button'
      }
    });
    
    The shorthand string version defaults to css selectors
    taikoEyes.checkWindow({
      target: 'region',
      tag: 'Step1',
      sizeMode: 'selector',
      selector: '.action-element',
    });
    ```

* ##### `region`
  (optional): In case [`target`](#target) is `region`, this should be an object describing the region's coordinates for capturing the image. For example:

    ```js
    taikoEyes.checkWindow({
      target: 'region',
      region: {top: 100, left: 0, width: 1000, height: 200}
    });
    ```

* ##### `ignore`
  (optional): A single or an array of regions to ignore when checking for visual differences. For example:

    ```js
    taikoEyes.checkWindow({
      ignore: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-ignore'}
      ]
    });
    ```

* ##### `floating`
  (optional): A single or an array of floating regions to ignore when checking for visual differences. More information about floating regions can be found in Applitools docs [here](https://help.applitools.com/hc/en-us/articles/360006915292-Testing-of-floating-UI-elements). For example:

    ```js
    taikoEyes.checkWindow({
      floating: [
        {top: 100, left: 0, width: 1000, height: 100, maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
        {selector: '.some-div-to-float', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20}
      ]
    });
    ```

* ##### `layout`
  (optional): A single or an array of regions to match as [layout level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

    ```js
    taikoEyes.checkWindow({
      layout: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-layout'}
      ]
    });
    ```

* ##### `strict`
  (optional): A single or an array of regions to match as [strict level.](https://help.applitools.com/hc/en-us/articles/360007188591-Match-Levels) For example:

    ```js
    taikoEyes.checkWindow({
      strict: [
        {top: 100, left: 0, width: 1000, height: 100},
        {selector: '.some-div-to-test-as-strict'}
      ]
    });
    ```

* ##### `scriptHooks`
  (optional): A set of scripts to be run by the browser during the rendering. It is intended to be used as a means to alter the page's state and structure at the time of rendering.
  An object with the following properties:
    * ##### `beforeCaptureScreenshot`: a script that runs after the page is loaded but before taking the screenshot. For example:
        
        ```js
        taikoEyes.checkWindow({
          scriptHooks: {
            beforeCaptureScreenshot: "document.body.style.backgroundColor = 'gold'"
          }
        })
        ```

#### Close

Close the applitools test and check that all screenshots are valid.

It is important to call this at the end of each test, symmetrically to `eyesOpen`(or in `afterEach()`
Close receives no arguments.

```js
await taikoEyes.close();
```