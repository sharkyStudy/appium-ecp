
import log from '../logger.js';
import helpers from '../helpers';
import converter from './converter.js';
import JSZip from 'jszip';

let systemCallMethods = {};
const DEFAULT_ECP_EXEC_TIMEOUT = 30000;

systemCallMethods.appUI = async function appUI () {
  log.info('Getting app UI...');
  try {
    const extServerOptions = {
      method: 'GET',
      url: `http://${this.ip}:${this.ecpPort}/query/app-ui`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    const response = await helpers.makeRequest(extServerOptions);
    return await response.data;
  } catch (error) {
    log.errorAndThrow(`Error while getting connected devices. Original error: ${error.message}`);
  }
};

systemCallMethods.activeApp = async function activeApp () {
  log.info('Getting active app...');
  try {
    const extServerOptions = {
      method: 'GET',
      url: `http://${this.ip}:${this.ecpPort}/query/active-app`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    const response = await helpers.makeRequest(extServerOptions);
    return converter.convertActiveApp(response.data);
  } catch (error) {
    log.errorAndThrow(`Error while getting active app. Original error: ${error.message}`);
  }
};

systemCallMethods.apps = async function apps () {
  try {
    const extServerOptions = {
      method: 'GET',
      url: `http://${this.ip}:${this.ecpPort}/query/apps`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    const response = await helpers.makeRequest(extServerOptions);
    return converter.convertToApps(await response.data);
  } catch (error) {
    log.errorAndThrow(`Error while getting connected devices. Original error: ${error.message}`);
  }
};

systemCallMethods.installFromQuery = async function installFromQuery (appId) {
  log.info(`Installing app ${appId}...`);
  let isInstalled = false;
  try {
    let apps = await this.apps();
    apps.forEach((app) => {
      if (app.id === appId) {
        isInstalled = true;
      }
    });
    if (isInstalled) {
      return isInstalled;
    } else {
      const extServerOptions = {
        method: 'POST',
        url: `http://${this.ip}:${this.ecpPort}/install/${appId}`,
        timeout: DEFAULT_ECP_EXEC_TIMEOUT
      };
      isInstalled = await helpers.makeNavigationRequest(extServerOptions);
    }
    log.info(`App is${!isInstalled ? ' not' : ''} installed`);
    return isInstalled;
  } catch (error) {
    log.errorAndThrow(error.message);
  }
};

systemCallMethods.launch = async function launch (appId, contentId = '', mediaType = '') {
  log.info(`Launch app ${appId}...`);
  let isLaunched = false;
  try {
    const extServerOptions = {
      method: 'POST',
      url: `http://${this.ip}:${this.ecpPort}/launch/${appId}?contentId=${contentId}&mediaType=${mediaType}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    isLaunched = await helpers.makeNavigationRequest(extServerOptions);
    log.info(`App is${!isLaunched ? ' not' : ''} launched`);
    return isLaunched;
  } catch (error) {
    log.errorAndThrow(error.message);
  }
};

systemCallMethods.icon = async function icon (appId) {
  log.info(`Getting icon from app wit id ${appId}...`);
  try {
    const extServerOptions = {
      method: 'GET',
      url: `http://${this.ip}:${this.ecpPort}/query/icon/${appId}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    const response = await helpers.makeRequest(extServerOptions);
    return await response.data;
  } catch (error) {
    log.errorAndThrow(error.message);
  }
};

systemCallMethods.device = async function device () {
  log.info('Getting devices information...');
  try {
    const extServerOptions = {
      method: 'GET',
      url: `http://${this.ip}:${this.ecpPort}/query/device-info`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    const response = await helpers.makeRequest(extServerOptions);
    return converter.convertToDeviceInfo(await response.data);
  } catch (error) {
    log.errorAndThrow(error);
  }
};

systemCallMethods.keyPress = async function keyPress (key) {
  log.info(`Key press ${key}...`);
  try {
    const extServerOptions = {
      method: 'POST',
      url: `http://${this.ip}:${this.ecpPort}/keypress/${key}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    return await helpers.makeNavigationRequest(extServerOptions);
  } catch (error) {
    log.errorAndThrow(`Error while try key press. Original error: ${error.message}`);
  }
};

systemCallMethods.keyDown = async function keyDown (key) {
  log.info(`Key down press ${key}...`);
  try {
    const extServerOptions = {
      method: 'POST',
      url: `http://${this.ip}:${this.ecpPort}/keydown/${key}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    return await helpers.makeNavigationRequest(extServerOptions);
  } catch (error) {
    log.errorAndThrow(`Error while try keydown press. Original error: ${error.message}`);
  }
};

systemCallMethods.keyUp = async function keyUp (key) {
  log.info(`Key up press ${key}...`);
  try {
    const extServerOptions = {
      method: 'POST',
      url: `http://${this.ip}:${this.ecpPort}/keyup/${key}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    return await helpers.makeNavigationRequest(extServerOptions);
  } catch (error) {
    log.errorAndThrow(`Error while try keyup press. Original error: ${error.message}`);
  }
};

systemCallMethods.type = async function type (text) {
  for (const char of text) {
    await this.keyPress(char);
  }
};

systemCallMethods.search = async function search (paramsSearch) {
  log.info(`Search with params ${paramsSearch}...`);
  try {
    const extServerOptions = {
      method: 'POST',
      url: `http://${this.ip}:${this.ecpPort}/search/browse?${paramsSearch}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    return await helpers.makeNavigationRequest(extServerOptions.data);
  } catch (error) {
    log.errorAndThrow(`Error while try search. Original error: ${error.message}`);
  }
};

systemCallMethods.player = async function player () {
  log.info('Getting player...');
  try {
    const extServerOptions = {
      method: 'GET',
      url: `http://${this.ip}:${this.ecpPort}/query/media-player`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    const response = await helpers.makeRequest(extServerOptions);
    return converter.convertPlayer(await response.data);
  } catch (error) {
    log.errorAndThrow(error.message);
  }
};

systemCallMethods.input = async function input (paramsInput) {
  log.info('Sends custom events to the current app...');
  try {
    const extServerOptions = {
      method: 'POST',
      url: `http://${this.ip}:${this.ecpPort}/input?${paramsInput}`,
      timeout: DEFAULT_ECP_EXEC_TIMEOUT
    };
    return await helpers.makeNavigationRequest(extServerOptions);
  } catch (error) {
    log.errorAndThrow(error.message);
  }
};

systemCallMethods.setDeviceId = async function setDeviceId () {
  log.info('Getting uid device...');
  let { udn } = await this.device();
  return udn;
};

systemCallMethods.checkVersion = async function checkVersion (app) {
  log.info('Checking version...');
  const zip = await JSZip.loadAsync(app);
  const manifest = await zip.file('manifest').async('string');
  const name = manifest.match(/^title\s*=(.+)/m)[1].trim();
  const major = +manifest.match(/^major_version\s*=(.+)/m)[1].trim();
  const minor = +manifest.match(/^minor_version\s*=(.+)/m)[1].trim();
  const build = +manifest.match(/^build_version\s*=(.+)/m)[1].trim();
  return {
    name,
    version: `${major}.${minor}.${build}`
  };
};

export default systemCallMethods;