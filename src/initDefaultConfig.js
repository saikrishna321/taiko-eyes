'use strict';

const { ConfigUtils } = require('@applitools/eyes-common');
const { configParams: visualGridConfigParams } = require('@applitools/visual-grid-client');
const { TypeUtils } = require('@applitools/eyes-common');

function initDefaultConfig(configPath = undefined) {
  const taikoConfigParams = ['tapDirPath', 'failTaikoOnDiff'];
  const calculatedConfig = ConfigUtils.getConfig({
    configParams: [...visualGridConfigParams, ...taikoConfigParams],
    configPath,
  });
  const defaultConfig = {
    failTaikoOnDiff: true,
    concurrency: 1,
  };
  const configResult = { ...defaultConfig, ...calculatedConfig };
  return configResult;
}

module.exports = initDefaultConfig;
