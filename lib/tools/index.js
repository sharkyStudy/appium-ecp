
import systemCallMethods from './system-calls.js';
import methods from './ecp-commands';
import appUtilsMethods from './app-utils';
import developmentAppMethods from './development-app-ecp.js';

Object.assign(methods, systemCallMethods, appUtilsMethods, developmentAppMethods);

export default methods;
