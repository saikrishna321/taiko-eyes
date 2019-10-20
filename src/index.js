import path from 'path';
import Eyes from './eyes';

const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');

const ID = 'eyes';
const taikoEyes = new Eyes({ configPath });

const init = async (taiko, descEmitter) => {
  taikoEyes._setTaiko(taiko, descEmitter);
};

module.exports = {
  ID,
  init,
  taikoEyes,
};
