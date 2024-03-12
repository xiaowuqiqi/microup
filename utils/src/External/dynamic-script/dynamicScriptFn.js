/* eslint-disable no-console */
import {EventEmitter} from 'events';

const eventBus = new EventEmitter();
const loadFlag = {};
const dynamicScriptFn = async (args) => {
  let ready = false;
  let failed = false;
  if (!args.url) {
    return;
  }
  // 已加载的资源不再重新加载
  const scripts = Array.from(document.getElementsByTagName('script'));
  const isExist = scripts.find(script => script.src === args.url);
  if (isExist) {
    if (
      loadFlag[args.url]
      || args.url?.includes(`localhost:${window.location.port}`)
      || args.url?.includes(`127.0.0.1:${window.location.port}`)
    ) {
      ready = true;
    } else {
      return new Promise((resolve) => {
        eventBus.once(args.url, () => {
          ready = true
          resolve({ready, failed});
        });
      })
    }
    return {
      ready,
      failed,
    };
  }

  const element = document.createElement('script');

  element.src = args.url;
  element.type = 'text/javascript';
  element.async = true;
  ready = false;
  failed = false;
  return new Promise((resolve) => {
    element.onload = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Dynamic Script Loaded: ${args.url}`);
      }

      loadFlag[args.url] = true;
      ready = true
      resolve({ready, failed})
      eventBus.emit(args.url);
    };
    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      ready = false
      failed = true
      document.head.removeChild(element);
      resolve({ready, failed})
    };
    document.head.appendChild(element);
  })
}
export default dynamicScriptFn;
