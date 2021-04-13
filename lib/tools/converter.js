
import { xml2json } from 'xml-js';

let converter = {};

converter.convertToApps = function convertToApps (data) {
  let appsInfo = [];
  let json = xml2json(data, {
    compact: true,
    spaces: 4
  });
  let app = JSON.parse(json).apps.app;
  for (let channel of app) {
    appsInfo.push({
      'id': channel._attributes.id,
      'subtype': channel._attributes.subtype ? channel._attributes.subtype : '',
      'type': channel._attributes.type,
      'version': channel._attributes.version,
      'appName': channel._text
    });
  }
  return appsInfo;
};

converter.convertActiveApp = function convertActiveApp (data) {
  let app;
  let json = xml2json(data, {
    compact: true,
    spaces: 4
  });
  let activeApp = JSON.parse(json)['active-app'];
  if (activeApp.app._attributes !== undefined) {
    if (activeApp.screensaver !== undefined && activeApp.app._text === 'Roku Media Player') {
      // The query/active-app command if the user is in the Roku Media Player with an active screensaver.
      app = {
        app: {
          attributes: activeApp.app._attributes,
          name: activeApp.app._text
        },
        screensaver: {
          attributes: activeApp.screensaver._attributes,
          name: activeApp.screensaver._text
        }
      };
    } else {
      // The query/active-app command if the user is in the Netflix app.
      app = {
        app: {
          attributes: activeApp.app._attributes,
          name: activeApp.app._text
        }
      };
    }
  } else {
    if (activeApp.app.screensaver !== undefined && activeApp.app._text === 'Roku') {
      // The query/active-app command if the user is in the homescreen but the default screensaver is active.
      app = {
        app: activeApp.app._text,
        screensaver: {
          attributes: activeApp.screensaver._attributes,
          name: activeApp.screensaver._text
        }
      };
    } else {
      // The query/active-app command if the user is in the homescreen.
      app = {
        app: activeApp.app._text
      };
    }
  }
  return app;
};

converter.convertPlayer = function convertPlayer (data) {
  let json = xml2json(data, {
    compact: true,
    spaces: 4
  });
  let player = JSON.parse(json).player;
  return {
    'attributes': {
      'error': player._attributes.error,
      'state': player._attributes.state,
    },
    'plugin': {
      'bandwidth': player.plugin._attributes.bandwidth,
      'id': player.plugin._attributes.id,
      'name': player.plugin._attributes.name
    },
    'format': {
      'audio': player.format._attributes.audio,
      'captions': player.format._attributes.captions,
      'container': player.format._attributes.container,
      'drm': player.format._attributes.drm,
      'video': player.format._attributes.video
    },
    'buffering': {
      'current': player.buffering._attributes.current,
      'max': player.buffering._attributes.max,
      'target': player.buffering._attributes.target
    },
    'new_stream': {
      'current': player.new_stream._attributes.speed
    },
    'position': player.position._text,
    'duration': player.duration._text,
    'is_live': player.is_live._text,
    'stream_segment': {
      'bitrate': player.stream_segment._attributes.bitrate,
      'media_sequence': player.stream_segment._attributes.media_sequence,
      'segment_type': player.stream_segment._attributes.segment_type,
      'time': player.stream_segment._attributes.time
    }
  };
};

converter.convertToDeviceInfo = function convertToDeviceInfo (data) {
  let json = xml2json(data, {
    compact: true,
    spaces: 4
  });
  let deviceInfo = JSON.parse(json)['device-info'];
  return {
    'udn': deviceInfo.udn._text,
    'serial-number': deviceInfo['serial-number']._text,
    'device-id': deviceInfo['device-id']._text,
    'advertising-id': deviceInfo['advertising-id']._text,
    'vendor-name': deviceInfo['vendor-name']._text,
    'model-name': deviceInfo['model-name']._text,
    'model-number': deviceInfo['model-number']._text,
    'model-region': deviceInfo['model-region']._text,
    'is-tv': deviceInfo['is-tv']._text,
    'is-stick': deviceInfo['is-stick']._text,
    'supports-ethernet': deviceInfo['supports-ethernet']._text,
    'wifi-mac': deviceInfo['wifi-mac']._text,
    'wifi-driver': deviceInfo['wifi-driver']._text,
    'network-type': deviceInfo['network-type']._text,
    'network-name': deviceInfo['network-name']._text,
    'friendly-device-name': deviceInfo['friendly-device-name']._text,
    'friendly-model-name': deviceInfo['friendly-model-name']._text,
    'default-device-name': deviceInfo['default-device-name']._text,
    'user-device-name': deviceInfo['user-device-name']._text,
    'user-device-location': deviceInfo['user-device-location']._text,
    'build-number': deviceInfo['build-number']._text,
    'software-version': deviceInfo['software-version']._text,
    'software-build': deviceInfo['software-build']._text,
    'secure-device': deviceInfo['secure-device']._text,
    'language': deviceInfo.language._text,
    'country': deviceInfo.country._text,
    'locale': deviceInfo.locale._text,
    'time-zone-auto': deviceInfo['time-zone-auto']._text,
    'time-zone': deviceInfo['time-zone']._text,
    'time-zone-name': deviceInfo['time-zone-name']._text,
    'time-zone-tz': deviceInfo['time-zone-tz']._text,
    'time-zone-offset': deviceInfo['time-zone-offset']._text,
    'clock-format': deviceInfo['clock-format']._text,
    'uptime': deviceInfo.uptime._text,
    'power-mode': deviceInfo['power-mode']._text,
    'supports-suspend': deviceInfo['supports-suspend']._text,
    'supports-find-remote': deviceInfo['supports-find-remote']._text,
    'find-remote-is-possible': deviceInfo['find-remote-is-possible']._text,
    'supports-audio-guide': deviceInfo['supports-audio-guide']._text,
    'developer-enabled': deviceInfo['developer-enabled']._text,
    'keyed-developer-id': deviceInfo['keyed-developer-id']._text,
    'search-enabled': deviceInfo['search-enabled']._text,
    'search-channels-enabled': deviceInfo['search-channels-enabled']._text,
    'voice-search-enabled': deviceInfo['voice-search-enabled']._text,
    'notifications-enabled': deviceInfo['notifications-enabled']._text,
    'notifications-first-use': deviceInfo['notifications-first-use']._text,
    'supports-private-listening': deviceInfo['supports-private-listening']._text,
    'headphones-connected': deviceInfo['headphones-connected']._text,
    'supports-ecs-textedit': deviceInfo['supports-ecs-textedit']._text,
    'supports-ecs-microphone': deviceInfo['supports-ecs-microphone']._text,
    'supports-wake-on-wlan': deviceInfo['supports-wake-on-wlan']._text,
    'has-play-on-roku': deviceInfo['has-play-on-roku']._text,
    'has-mobile-screensaver': deviceInfo['has-mobile-screensaver']._text,
    'support-url': deviceInfo['support-url']._text,
    'grandcentral-version': deviceInfo['grandcentral-version']._text,
    'has-wifi-extender': deviceInfo['has-wifi-extender']._text,
    'has-wifi-5G-support': deviceInfo['has-wifi-5G-support']._text,
    'can-use-wifi-extender': deviceInfo['can-use-wifi-extender']._text
  };
};

export {converter};
export default converter;