
import _ from 'lodash';
import methods from './tools/index.js';

const DEFAULT_ECP_PORT = 8060;
let DEFAULT_OPTS = {
  ip: null,
  udn: null,
  username: null,
  password: null,
  ecpPort: DEFAULT_ECP_PORT
};

class ECP {
  constructor (opts = {}) {
    Object.assign(this, opts);
    _.defaultsDeep(this, _.cloneDeep(DEFAULT_OPTS));
  }
}

// eslint-disable-next-line require-await
ECP.createECP = async function createECP (opts) {
  const ecp = new ECP(opts);
  return ecp;
};

// add all the methods to the ECP prototype
for (let [fnName, fn] of _.toPairs(methods)) {
  ECP.prototype[fnName] = fn;
}

export default ECP;
export {ECP, DEFAULT_ECP_PORT};