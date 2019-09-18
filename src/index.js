import Eyes from './eyes';
import path from 'path';
const configPath = path.resolve(__dirname, '../fixtures/applitools.config.js');

const ID = 'eyes';
let taikoEyes = new Eyes({ configPath });

let init = async (taiko, descEmitter) => {
  taikoEyes._setTaiko(taiko, descEmitter);
};

module.exports = {
  ID,
  init,
  taikoEyes,
};
