const path = require('path');
const initDefaultConfig = require('../../src/initDefaultConfig');

test('Init Default Config', async () => {
  const configPath = path.resolve(__dirname, '../../testSeed/applitools.config.js');
  process.env.APPLITOOLS_API_KEY = 'API-KEY';
  process.env.APPLITOOLS_TAP_DIR_PATH = 'SOME PATH';
  const config = initDefaultConfig(configPath);
  expect(config).toEqual({
    apiKey: 'API-KEY',
    concurrency: 1,
    failTaikoOnDiff: true,
    isDisabled: false,
    showLogs: true,
    someKey: 'someValue',
    tapDirPath: 'SOME PATH',
  });
});
