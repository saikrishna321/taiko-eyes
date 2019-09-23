import initDefaultConfig from './initDefaultConfig';
const { Logger } = require('@applitools/eyes-common');
const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerialize } = require('@applitools/dom-snapshot');
const { presult } = require('@applitools/functional-commons');
const { errorAndDiff, errorPerStep } = require('./errorsAndDiffs');
const errorDigest = require('./errorDigest');

let _taiko = null;
let _descEmitter = null;

class Eyes {
  constructor({ configPath } = {}) {
    this._defaultConfig = initDefaultConfig(configPath);
    this._logger = new Logger(this._defaultConfig.showLogs, 'eyes');
    this._logger.log('[constructor] initial config', this._defaultConfig);
    this._client = makeVisualGridClient({
      showLogs: true,
      logger: this._logger.extend('Visual Grid Client'),
      ...this._defaultConfig,
    });
    this._currentTest = null;
  }

  async open(args) {
    this._logger.log('open fn called by user!');
    this._currentTest = await this._initEyes(args);
  }

  checkWindow(options) {
    return this._getCDT().then(({ cdt, url, resourceUrls, resourceContents, frames }) => {
      const defaultCDT = {
        url,
        cdt,
        resourceUrls,
        resourceContents,
        frames,
      };
      this._currentTest.eyes.checkWindow({ ...defaultCDT, ...options });
    });
  }

  async close() {
    const [results] = await presult(this._currentTest.eyes.close());
    if (results === undefined) {
      console.log('Eyes Test Passed!!');
    } else {
      const { failed, diffs } = await errorAndDiff(results);
      if (failed.length || diffs.length) {
        const { failedStep, passedStep } = errorPerStep(results);
        throw new Error(errorDigest({ failed, diffs, failedStep, passedStep }));
      }
    }
  }
  async _getCDT() {
    const processPageAndSerializeScript = await getProcessPageAndSerialize();
    const { cdt, url, resourceUrls, blobs, frames } = await _taiko.evaluate(
      (root, args) => {
        return eval(args[0]);
      },
      { args: [`(${processPageAndSerializeScript})()`] },
    );
    const resourceContents = blobs.map(({ url, type, value }) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));
    return { cdt, url, resourceUrls, resourceContents, frames };
  }

  async _initEyes(args) {
    const testInfo = this._initTestInfo({
      isTestStarted: true,
      isDisabled: this._defaultConfig.isDisabled || args.isDisabled,
      config: {
        ...this._defaultConfig,
        ...args,
      },
    });

    if (this._defaultConfig.eyesIsDisabled && args.isDisabled === false) {
      throw new Error(`Eyes is globaly disabled (via APPLITOOLS_IS_DISABLED or with applitools.config.js)`);
    }

    if (testInfo.isDisabled) {
      return testInfo;
    }

    const stringableConfig = { ...testInfo.config };
    this._logger.log(`[_initEyes] opening with ${JSON.stringify(stringableConfig)}`);

    testInfo.eyes = await this._client.openEyes(testInfo.config);
    return testInfo;
  }

  _initTestInfo(info) {
    return {
      isTestStarted: false,
      isDisabled: false,
      config: null,
      eyes: null,
      closePromise: null,
      ...info,
    };
  }

  _setTaiko(taiko, descEmitter) {
    _taiko = taiko;
    _descEmitter = descEmitter;
  }
}

module.exports = Eyes;
