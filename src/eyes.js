import initDefaultConfig from './initDefaultConfig';
const { Logger } = require('@applitools/eyes-common');
const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerializeScript } = require('@applitools/dom-snapshot');

let _taiko = null;
let _descEmitter = null;
let processPageAndSerialize;

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

  async checkWindow() {
    const { cdt, url, resourceUrls, resourceContents, frames } = await this._getCDT();
    await this._currentTest.checkWindow({
      tag: 'first test',
      target: 'region',
      fully: false,
      url,
      cdt,
      resourceUrls,
      resourceContents,
      frames,
    });
  }

  async close() {
    await this._currentTest.close();
  }
  async _getCDT() {
    const processPageAndSerializeScript = await getProcessPageAndSerializeScript();
    const a = await _taiko.evaluate(async () => `(${processPageAndSerializeScript})()`);
    const { cdt, url, resourceUrls, blobs, frames } = await _taiko.evaluate(
      async () => `(${processPageAndSerializeScript})()`,
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
