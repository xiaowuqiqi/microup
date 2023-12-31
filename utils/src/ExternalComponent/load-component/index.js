import React from 'react';

function loadComponent(scope, module, onError, setLoad) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    if (!container) {
      throw new Error('加载了错误的importManifest.js，请检查服务版本');
    }
    try {
      await container.init(__webpack_share_scopes__.default);
      const factory = await window[scope].get(module);
      const Module = factory();
      if(setLoad)setLoad(true);
      return Module;
    } catch (e) {
      if (onError) {
        return onError(e);
      }
      throw e;
    }
  };
}

export default loadComponent;
