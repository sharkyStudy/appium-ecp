
import log from '../logger.js';

let appUtilsMethods = {};

appUtilsMethods.isAppInstalled = async function isAppInstalled (appId) {
  try {
    let apps = await this.apps();
    let isAppInstalled = apps.find((app) => app.id === appId);
    log.info(`App is${!isAppInstalled ? ' not' : ''} installed`);
    return isAppInstalled;
  } catch (error) {
    log.errorAndThrow(`Error finding if app is installed. Original error: ${error.message}`);
  }
};

appUtilsMethods.isStartedApp = async function isStartedApp (appId) {
  log.info(`Checking if app ${appId} is started`);
  try {
    let started = false;
    let {app} = await this.activeApp();
    if (app.attributes !== undefined) {
      started = (app.attributes.id === appId.toString()) ? true : false;
    }
    log.info(`App is${!started ? ' not' : ''} started`);
    return started;
  } catch (error) {
    log.errorAndThrow(`Error finding if app is installed. Original error: ${error.message}`);
  }

};

appUtilsMethods.startApp = async function startApp (appId, contentId = '', mediaType = '') {
  try {
    await this.launch(appId, contentId, mediaType);
  } catch (error) {
    log.errorAndThrow(`Error launch app. Original error: ${error.message}`);
  }
};

export default appUtilsMethods;