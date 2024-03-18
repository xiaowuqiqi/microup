// 这段可选代码用于注册一个服务工作线程（Service Worker）。
// 默认情况下不会调用register()。
// 这使得应用程序在后续访问时能够更快加载，并且具备离线功能。然而，这也意味着开发者（和用户）只会在再次访问页面时看到部署的更新，因为之前缓存的资源是在后台更新的，只有关闭了页面上所有已存在的标签页后才会生效。
// 若要了解此模型的优势以及如何选择此选项，请阅读https://cra.link/PWA。

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  // 生产环境才会注册
  // 这是因为 ws 中，会引入 workBox 的很多包，这些包需要提前打包出来到 ws 中才可以运行 ws。
  if (
    'serviceWorker' in navigator
    //&& JSON.parse(window._env_.NODE_ENV) === 'production'
  ) {
    window.addEventListener('load', () => {
      const swUrl = `/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        // 此处运行在本地主机上。让我们检查服务工作线程是否仍然存在。
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        // 为本地主机添加一些额外的日志记录，指向服务工作线程/PWA文档。

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
            'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        // 不是本地主机。只需注册服务工作线程。
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.addEventListener("updatefound", () => {
        console.log('updatefound', registration)
        const update = (_worker) => {
          // 新的 sw 状态变更 installed 表示安装完毕，但是不会激活（worker in waiting）
          console.log('update', _worker.state, navigator.serviceWorker.controller)
          if (_worker.state === 'installed') {
            // 说明历史的 sw 还在激活状态
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              // 此时，更新的预缓存内容已被获取，但是之前的服务工作线程仍然会提供旧的内容，
              // 直到所有客户端标签页都关闭。
              console.log(
                'New content is available and will be used when all ' +
                'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              // 执行回调函数
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              // 此时，所有内容都已被预缓存。现在是显示“内容已缓存以供离线使用。”的完美时机。
              console.log('Content is cached for offline use.');

              // Execute callback
              // 执行回调函数
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        }
        // 新的 sw 更新时会触发
        const waitingWorker = registration.waiting;
        const installingWorker = registration.installed;
        console.log(waitingWorker, installingWorker)// todo null undefined 打印都为空，继续开发
        if (installingWorker) {
          installingWorker.onstatechange = () => update(installingWorker);
        }
        if (waitingWorker) {
          update(waitingWorker)
        }
      });
    })
    .catch((error) => {
      // service worker注册时出错:
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  // 检查是否可以找到服务工作线程。如果找不到，重新加载页面。
  fetch(swUrl, {
    headers: {'Service-Worker': 'script'},
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      // 确保服务工作线程存在，并确保我们确实获得了一个JS文件。
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        // 没有找到服务工作线程。可能是不同的应用程序。重新加载页面。
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        // 找到服务工作线程。正常进行。
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
