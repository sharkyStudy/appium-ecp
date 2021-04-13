# 🚀 appium-ecp

[![NPM version](http://img.shields.io/npm/v/appium-ecp.svg)](https://npmjs.org/package/appium-ecp)
[![Downloads](http://img.shields.io/npm/dm/appium-ecp.svg)](https://npmjs.org/package/appium-ecp)

A wrapper over Roku ecp, implemented using ES6 and along with async/await. This package is mainly used by Appium to perform all ecp operations on Roku device.

## 🚀 Usage:

example:

```js
import ECP from "appium-ecp";

let ecp = new ECP();

await ecp.createECP({
  ip: "10.10.1.1",
  username: "rokuUser",
  password: "rokuPass",
});
```

### 🚀 List of methods:

```js
createECP();
```

```js
appUI();
```

```js
activeApp();
```

```js
apps();
```

```js
installFromQuery(appId, contentId, mediaType);
```

```js
icon(appId);
```

```js
device();
```

```js
keyPress(key);
```

```js
keyDown(key);
```

```js
keyUp(key);
```

```js
type(text);
```

```js
search(paramsSearch);
```

```js
player();
```

```js
input(appId, contentId, mediaType);
```

```js
setDeviceId();
```

```js
install(app);
```

```js
launch(appId, contentId, mediaType);
```
