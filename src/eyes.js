// import { ConsoleLogHandler } from '@applitools/eyes-sdk-core';
import initDefaultConfig from './initDefaultConfig';

const { Logger } = require('@applitools/eyes-common');
const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerialize } = require('@applitools/dom-snapshot');
const _ = require('lodash');
const { errorAndDiff, errorPerStep } = require('./errorsAndDiffs');
const errorDigest = require('./errorDigest');

class Eyes {
  _taiko = null;

  _descEmitter = null;

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
    this._closedTests = [];
  }

  async open(args) {
    this._currentTest = await this._initEyes(args);
    if (this._shouldSkip('open')) {
      return true;
    }
    this._logger.log('open fn called by user!');
    console.log(this._currentTest);
    return true;
  }

  checkWindow(options) {
    if (this._shouldSkip('checkwindow')) {
      return true;
    }
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
    if (this._shouldSkip('close')) {
      return true;
    }
    const closePromise = this._currentTest.eyes.close(false);
    this._currentTest.closePromise = closePromise;
    this._closedTests.push(this._currentTest);
    this._currentTest = null;
    return true;
  }

  async waitForResults() {
    const results = await Promise.all(this._closedTests.map(b => b.closePromise));
    _.flatten(results).forEach(async result => {
      if (result._status === 'Passed') {
        console.info('Eyes Test Passed!!');
      } else if (this._defaultConfig.failTaikoOnDiff) {
        const { failed, diffs } = await errorAndDiff(result);
        if (failed.length || diffs.length) {
          const { failedStep, passedStep } = errorPerStep(result);
          console.info(errorDigest({ failed, diffs, failedStep, passedStep }));
        }
      }
    });
    if (this._containsFailure(results)) throw new Error('Eyes Validation Failed!!');
  }

  _containsFailure(testsResults) {
    return testsResults.some(testResult => testResult.some(r => r.getStatus() !== 'Passed'));
  }

  async _getCDT() {
    const processPageAndSerializeScript = await getProcessPageAndSerialize();
    const { cdt, url, resourceUrls, blobs, frames } = await this._taiko.evaluate(
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

  _shouldSkip(methodName) {
    if (this._defaultConfig.isDisabled || this._currentTest.config.isDisabled || process.env.APPLITOOLS_IS_DISABLED) {
      this._logger.log(`eyes is disabled, skipping ${methodName}().`);
      return true;
    }
    return false;
  }

  _setTaiko(taiko, descEmitter) {
    this._taiko = taiko;
    this._descEmitter = descEmitter;
  }
}

module.exports = Eyes;
