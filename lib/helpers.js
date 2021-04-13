
import log from './logger.js';
import FormData from 'form-data';
import fetch from 'node-fetch';
import * as indigestion from 'indigestion';
import axios from 'axios';

let helpers = {};
const STATUS_CODE = {
  SUCCESS_OK: 200,
  SUCCESS_CREATED: 201,
  SUCCESS_ACCEPTED: 202,
  SUCCESS_NO_CONTENT: 204,
  ERROR_BAD_REQUEST: 400,
  ERROR_UNAUTHORIZED: 401,
  ERROR_FORBIDDEN: 403,
  ERROR_NOT_FOUND: 404
};
let isAuthentication;

helpers.makeNavigationRequest = async function makeNavigationRequest (extServerOptions) {
  let isRequestValid = false;
  const response = await this.makeRequest(extServerOptions);
  try {
    if (response.status === STATUS_CODE.SUCCESS_OK || response.status === STATUS_CODE.SUCCESS_ACCEPTED) {
      isRequestValid = true;
    } else {
      throw new Error('Command execution failed');
    }
  } catch (error) {
    log.errorAndThrow(error);
  }
  return isRequestValid;
};

helpers.makeRequest = async function makeRequest (extServerOptions) {
  return await axios(extServerOptions)
    .then((response) => response)
    .catch((error) => log.errorAndThrow(`Error while getting connected with the device. Original error: ${error.message}`));
};

helpers.makeRequestAuthorization = async function (extServerOptions) {
  const { method, url, path, username, password, data } = extServerOptions;
  const headers = {
    Authorization: await this.authorization(
      method,
      url,
      path,
      username,
      password
    ),
  };

  let body = this.buidlBody(data);
  let response;
  try {
    response = await fetch(`${url}/${path}`, { method, headers, body });

    if (!response.ok) {
      const text = await response.text();
      const error =
        text.match(/'error'\).trigger\(\s*'.*?'\s*,\s*'(.+?)'\s*\)/)?.[1] ||
        `${method} /${path} -> ${response.status} ${response.statusText}`;
      throw error;
    }

    if (response.headers.get('Content-Length') === '0') {
      return undefined;
    }

    if (response.headers.get('Content-Type').startsWith('text/')) {
      const text = await response.text();
      return text;
    }
  } catch (error) {
    log.errorAndThrow(error);
  }
  return response.buffer();
};

helpers.authorization = async function authorization (method, url, path, username, password) {
  if (!isAuthentication) {
    this.authentication = await fetch(url).then((response) =>
      response.headers.get('WWW-Authenticate')
    );
  }
  const authenticateHeader = await this.authentication;

  return indigestion.generateDigestAuth({
    method,
    authenticateHeader,
    uri: path,
    username,
    password,
  });
};

helpers.buidlBody = function (data) {
  let body;
  try {
    if (data) {
      body = new FormData();
      for (const [key, value] of Object.entries(data)) {
        body.append(key, value);
      }
    }
  } catch (error) {
    log.errorAndThrow(error);
  }
  return body;
};

export { helpers };
export default helpers;
