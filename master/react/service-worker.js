/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.
// 这个服务工作线程可以进行定制！
// 可以查看https://developers.google.com/web/tools/workbox/modules
// 以获取可用的Workbox模块列表，或添加任何其他代码。
// 如果你不想使用service worker，也可以删除此文件，Workbox构建步骤将被跳过。
import {clientsClaim, ManualHandlerCallback} from 'workbox-core';
import {precacheAndRoute, createHandlerBoundToURL} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate, NetworkFirst,CacheFirst} from 'workbox-strategies';
import {pageCache,warmStrategyCache,imageCache} from 'workbox-recipes';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';

clientsClaim();

// 预缓存所有生成的构建过程中的资源。
// 它们的URL被注入到下面的manifest变量中。
// 即使你决定不使用预缓存，此变量也必须存在于服务工作线程文件的某处。请参阅https://cra.link/PWA
const manifest = self.__WB_MANIFEST;
if (manifest) {
  console.log('precached', manifest);
  precacheAndRoute(manifest);
}

////////////// html
pageCache(
  // {warmCache: ['/index.html']}
);

/////////////// importManifest.js NetworkFirst
const strategy = new NetworkFirst();
const urls = ['/importManifest.js'];
warmStrategyCache({urls, strategy});
/////////////// js,css,worker
registerRoute(
  ({request}) =>
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script' ||
    // Web Workers
    request.destination === 'worker',
  new CacheFirst({
    cacheName: 'assets_app',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30天
      }),
    ],
  })
);
////////////// 图片、音乐、视频等。
// 一个示例的运行时缓存路由，用于处理未被预缓存处理的请求，此处为相同来源的.png请求，比如public/目录下的请求。
imageCache();
//////////// message
// 这允许web应用通过registration.waiting.postMessage({type: 'SKIP_WAITING'})触发skipWaiting。
self.addEventListener('message', (event) => {
  console.log('message', event)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
