const path = require('path');
const initDefaultConfig = require('../../src/initDefaultConfig');

test('Init Default Config', async () => {
    const configPath = path.resolve(__dirname, './applitools.config.js');
    process.env.APPLITOOLS_API_KEY = 'API-KEY';
    process.env.APPLITOOLS_TAP_DIR_PATH = 'SOME PATH';
    const config = initDefaultConfig(configPath);
    expect(config).toEqual(
        {
            agentId: `eyes-testcafe/${packageVersion}`,
            apiKey: 'OVERIDEN!!!',
            concurrency: 1,
            failTestcafeOnDiff: true,
            isDisabled: false,
            showLogs: true,
            someKey: 'someValue',
            tapDirPath: 'SOME PATH',
          }
    )
  });