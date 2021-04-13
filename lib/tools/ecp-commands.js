
let methods = {};

methods.isDeviceConnected = async function isDeviceConnected () {
  return await this.device();
};

export default methods;