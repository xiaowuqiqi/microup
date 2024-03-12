/* eslint-disable no-console */
import React from 'react';
import { EventEmitter } from 'events';

const eventBus = new EventEmitter();
const loadFlag = {};
const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
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
        setReady(true);
      } else {
        eventBus.once(args.url, () => {
          setReady(true);
        });
      }
      return () => {
        console.log(`Dynamic Script Removed: ${args.url}`);
        // document.head.removeChild(element);
      };
    }

    const element = document.createElement('script');

    element.src = args.url;
    element.type = 'text/javascript';
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Dynamic Script Loaded: ${args.url}`);
      }

      loadFlag[args.url] = true;
      setReady(true);
      eventBus.emit(args.url);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
      document.head.removeChild(element);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      // document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

export default useDynamicScript;
