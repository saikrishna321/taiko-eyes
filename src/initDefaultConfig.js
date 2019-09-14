'use strict';

const { ConfigUtils } = require('@applitools/eyes-common');
const { configParams: visualGridConfigParams } = require('@applitools/visual-grid-client');
const { TypeUtils } = require('@applitools/eyes-common');

function initDefaultConfig(configPath = undefined) {
  const testcafeConfigParams = ['tapDirPath', 'failTaikoOnDiff'];
  const calculatedConfig = ConfigUtils.getConfig({
    configParams: [...visualGridConfigParams, ...testcafeConfigParams],
    configPath,
  });
  const defaultConfig = {
    failTaikoOnDiff: true,
    concurrency: 1,
  };
  const configResult = { ...defaultConfig, ...calculatedConfig };
  if (configResult.failTaikoOnDiff === '0') {
    configResult.failTaikoOnDiff = false;
  }
  if (TypeUtils.isString(configResult.showLogs)) {
    configResult.showLogs = configResult.showLogs === 'true' || configResult.showLogs === '1';
  }
  return configResult;
}

module.exports = initDefaultConfig;
