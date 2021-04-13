
import log from '../logger.js';
import helpers from '../helpers';

let developmentAppMethods = {};

developmentAppMethods.install = async function install (app) {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_install',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Replace',
      archive: app,
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.deleteApp = async function deleteApp () {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_install',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Delete',
      archive: '',
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.convertToCramFs = async function convertToCramFs () {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_install',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Convert to cramfs',
      archive: '',
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.convertToSquashFs = async function convertToSquashFs () {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_install',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Convert to squashfs',
      archive: '',
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.packageApp = async function packageApp (name) {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_install',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Package',
      pkg_time: new Date().getTime().toString(),
      app_name: name,
      passwd: this.password
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.deletePackage = async function deletePackage () {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_install',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Delete',
      pkg_time: '',
      app_name: '',
      passwd: ''
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.getPackage = async function getPackage () {
  const extServerOptions = {
    method: 'GET',
    url: `http://${this.ip}`,
    path: 'plugin_package',
    username: this.username,
    password: this.password,
  };
  const response = await helpers.makeRequestAuthorization(extServerOptions);
  const packageApp = response.match(/pkgs\/*\w+.pkg/)[0];

  if (!packageApp) {
    log.errorAndThrow('Could not found packaged app');
    return;
  }
  return response;
};

developmentAppMethods.reKey = async function reKey (pkg) {
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_inspect',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Rekey',
      passwd: this.password,
      archive: pkg
    }
  };
  await helpers.makeRequestAuthorization(extServerOptions);
};

developmentAppMethods.getScreenshot = async function getScreenshot () {
  log.info(`Get Screenshot from app...`);
  const extServerOptions = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_inspect',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'Screenshot'
    }
  };
  const response = await helpers.makeRequestAuthorization(extServerOptions);
  const imgUrl = response.match(/pkgs\/dev\.(png|jpg)/)[0];

  if (!imgUrl) {
    log.errorAndThrow('make sure that device is enabled and sideloaded app is launched');
    return;
  }
  const extServerOptionsImg = {
    method: 'GET',
    url: `http://${this.ip}`,
    path: imgUrl,
    username: this.username,
    password: this.password,
  };
  return await helpers.makeRequestAuthorization(extServerOptionsImg);
};

developmentAppMethods.getProfilingData = async function getProfilingData () {
  const extServerOptionsPlugInspect = {
    method: 'POST',
    url: `http://${this.ip}`,
    path: 'plugin_inspect',
    username: this.username,
    password: this.password,
    data: {
      mysubmit: 'dloadProf'
    }
  };

  const extServerOptionsChannelBsprof = {
    method: 'GET',
    url: `http://${this.ip}`,
    path: 'pkgs/channel.bsprof',
    username: this.username,
    password: this.password,
  };
  try {
    const response = await helpers.makeRequestAuthorization(extServerOptionsPlugInspect);
    const isBsprof = !response.includes('pkgs/channel.bsprof');

    if (!isBsprof) {
      throw 'No profiling data found on device';
    }
  } catch (error) {
    log.errorAndThrow(error);
  }
  return await helpers.makeRequestAuthorization(extServerOptionsChannelBsprof);
};

export default developmentAppMethods;
