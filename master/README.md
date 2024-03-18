# master

master 包主要负责状态数据的存储，权限校验与重定向、顶层路由处理、多语言等工作。所有的 remote 模块都会经过 master 代码控制然后渲染。

> 目前未添加权限，多语言模块，如有需要可自行在master添加。

全局的事件触发，通用数据也都可以添加到 master 内，并且这些数据共享，可完成不同模块间数据通信。

## store

masterStore 是通过 mobx 进行实现的状态数据池，它可以存储一些全局动态的状态数据，并且在所有 remote 模块中都可以访问到这些数据。

### **源码**

masterStore 的核心代码如下，用于注册一个 Store

```tsx
import React from 'react';
import {observer, useLocalObservable} from 'mobx-react';
import {runInAction} from 'mobx';
import { Provider } from 'mobx-react';

interface IIssue {
  // data
}

const useMainLocalStore = () => {
  const masterStore = useLocalObservable(() => ({
    data: {} as IIssue,
    get(key: string) {
      return masterStore.data[key]
    },
    set(key, value) {
      runInAction(function () {
        masterStore.data[key] = value
      })
    }
  }));
  return masterStore;
};

const MasterStoreProvider: React.FC<any> = observer((props) => {
  const {children} = props;
  const masterStore = useMainLocalStore();
  return <Provider masterStore={masterStore}>{children}</Provider>;
});

export {MasterStoreProvider};
```

包裹跟节点

```jsx
import React from 'react';
……
import {MasterStoreProvider} from './store';
……
const InnerIndex = (props) => {
  const {match, AutoRouter} = props
  return (
    <MasterStoreProvider>
      ……
    </MasterStoreProvider>
  )
};

export default withRouter(InnerIndex);
```

### **使用**

可以实现不同 remote 模块间数据通信，也可以使得一个模块触发另一个模块的视图渲染。

测试案例如下：

开启一个 app1 服务作为 host 模块，它可以以一下两种方式访问 remote 模块，一种访问其中 remote 模块注册的一个组件，第二种访问整个的 remote 模块，详情也可查看 app1 与 app2 包的代码。

app1 作为 host 模块

```jsx
import React from 'react';
import {ExternalComponent} from '@microup/utils';
import {inject, observer} from 'mobx-react';

export default inject('masterStore')(observer((props) => {
  const {history, masterStore} = props
  return (
  <div>
    <button onClick={() => {
      masterStore.set('app2Test', !masterStore.get('app2Test'))
    }}>点击改变 app2Test 变量
    </button>
    <h5>引入 app2 externalize 组件</h5>
    <ExternalComponent
      system={{
        scope: 'app2', module: 'App2EC',
      }}
    />
    <h5>全量引入 app2 模块</h5>
    <div style={{borderLeft: "2px black solid",paddingLeft:'8px'}}>
      <ExternalComponent
        {...props}
        match={{...props.master, url: '/app1'}}
        system={{
          scope: 'app2', module: './app2',
        }}
      />
    </div>
  </div>
  )
}))
```

app2 externalize 组件

```jsx
import React from 'react';
import {observer,inject} from 'mobx-react';

export default inject('masterStore')(observer(({match, masterStore}) => {
return (<div>app2-externalize-components | app2Test: 	{String(!!masterStore.get('app2Test'))}</div>);
}))
/* externalize: App2EC */
```

app2 根目录

```jsx
import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {inject} from 'mobx-react';
import {ErrorPage} from '@microup/master';

const Page1 = React.lazy(() => import('./routes/Page1'));
const Page2 = React.lazy(() => import('./routes/Page2'));

function Index({match, masterStore}) {
  return (
    <Switch>
      <Route path={`${match.url}/page1`} component={Page1}/>
      <Route path={`${match.url}/page2`} component={Page2}/>
      <Route path={`${match.url}`} component={Page1}/>
      <Route path="*" component={ErrorPage}/>
    </Switch>
  );
}

export default inject('masterStore')(Index);
```

app2 page1

```jsx
import React from 'react';
import {inject, observer} from 'mobx-react';

export default inject('masterStore')(observer((props) => {
  const {match, masterStore} = props
  return (<div>
    app2 page1 | app2Test: {String(!!masterStore.get('app2Test'))}
  </div>)
}));
```

## master router

moaster router 控制这整个项目的跟路由，路由优先判断是否是`/error_page`或者`/undefined`进行全局的错误路由拦截，过滤后的路由会转入 AutoRouter，在 AutoRouter 组件中会处理一级路由并分发到对应 remote 模块

master.jsx

```jsx
import React from 'react';
import {Route, Outlet} from 'react-router-dom';
import {MasterStoreProvider} from './store';
import {Empty, ErrorPage} from '@microup/utils';

const Index = () => {
  // const {match, AutoRouter} = props
  return (
    <MasterStoreProvider>
      <Outlet/>
    </MasterStoreProvider>
  )
};
Index.getStaticRoutes = (AutoRouter) => {
  return [
    <Route key='./error_page' path='error_page' element={<ErrorPage/>}/>,
    <Route key='./undefined' path='undefined' element={<Empty/>}/>,
    ...AutoRouter.getStaticRoutes({
      ErrorComponent: <ErrorPage/>, // <Navigate to="/error_page"/>
      notFound: <Empty/>
    }),
  ]
}
export default Index;
```

> AutoRouter 组件位置在 routes.nunjucks.jsx 编译后在 tmp 目录中的 router.index.js 中，tmp 详情参考 boot 包文档。

### **一级路由处理**

首先访问 front 服务（ http://192.168.88.132:9090/ ），然后会进入 boot/tmp app.js 代码中

```jsx
const router = createBrowserRouter(
  createRoutesFromElements([
    <Route
      path='/*'
      element={<Master/>}
    >
      {Master.getStaticRoutes(AutoRouter)}
    </Route>
  ])
)
```

然后会执行 Master 代码，Master 在 config 中可以配置。 

master.jsx

```jsx
[
    <Route key='./error_page' path='error_page' element={<ErrorPage/>}/>,
    <Route key='./undefined' path='undefined' element={<Empty/>}/>,
    ...AutoRouter.getStaticRoutes({
      ErrorComponent: <ErrorPage/>, // <Navigate to="/error_page"/>
      notFound: <Empty/>
    }),
]
```

在 AutoRouter 中执行了这样代码，其作用是优先匹配 config.js 中设置的 routes 中的路由，如果匹配成功，则访问本地路由组件。

> routes 作用是一级路由与对应组件位置的描述
>
> ```bash
> # 只是本地开发
> routes: {
> a1: './src/exampleMaster/App1', # 路由为 http://192.168.20.133:9091/a1/
> a2: './src/exampleMaster/App2' # 路由为 http://192.168.20.133:9091/a2/
> }
> ```

```html
const AutoRouter = {}
AutoRouter.getStaticRoutes = (ExternalRouteProps = {}) => {
  const staticRoutes = ['{{ routes }}']
  staticRoutes.push(<Route path='*' key='externalRoute' element={<ExternalRoute {...ExternalRouteProps}/>}/>)
  return staticRoutes
}
```

如果没有匹配成功，则执行 `<ExternalRoute />` 组件，匹配对应 remote 模块。

 `<ExternalRoute />` 组件中，根据 `.env` 中配置的 `app` 或者 `STATIC_URL` 作为基地址，后边拼接 url 地址中的一级路由与`/importManifest.js`生成一个新的地址，类似`http://192.168.20.101:9095/a1/importManifest.js`。

然后创建一个新的 `script `标签 `src` 填入上边生成的地址。远程拉取 importManifest.js 代码，实现 remote 模块间连接。（实现方案详情参考[动态远程容器](https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers)）

### **总结**

代码优先执行的是 front 中的 boot 和 master 代码，然后执行 .env app 路由或 `<ExternalRoute />` 时才会去访问 remote 模块（加载如 http://192.168.88.132:9095/app1/importManifest.js 这样的js静态文件）。

## service worker

通过 workbox 实现 service worker 静态文件缓存与文件加载策略。

service-worker.js

```js
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
```
