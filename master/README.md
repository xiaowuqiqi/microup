# master

master 包主要负责状态数据的存储，权限校验与重定向、顶层路由处理、多语言等工作。所有的 remote 模块都会经过 master 代码控制然后渲染。

> 目前未添加权限，多语言模块，如有需要可自行在master添加。

全局的事件触发，通用数据也都可以添加到 master 内，并且这些数据共享，可完成不同模块间数据通信。

## store

masterStore 是通过 mobx 进行实现的状态数据池，它可以存储一些全局动态的状态数据，并且在所有 remote 模块中都可以访问到这些数据。

**源码**

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

**使用**

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
const InnerIndex = (props) => {
  const {match, AutoRouter} = props
  return (
    <MasterStoreProvider>
      <Switch>
        <Route exact path={`${match.url}${match.url === '/' ? '' : '/'}error_page`} component={ErrorPage}/>
        <Route exact path={`${match.url}${match.url === '/' ? '' : '/'}undefined`} component={Empty}/>
        <Route path={match.url} component={AutoRouter}/>
      </Switch>
    </MasterStoreProvider>
  )
};
```

> AutoRouter 组件位置在 routes.nunjucks.jsx 编译后在 tmp 目录中的 router.index.js 中，tmp 详情参考 boot 包文档。

**一级路由处理**

首先访问 front 服务（ http://192.168.88.132:9090/ ），然后会进入 boot/tmp app.js 代码中

```jsx
<Router hashHistory={createBrowserHistory} getUserConfirmation={getConfirmation}>
  <Suspense fallback={<Loading/>}>
    <Switch>
      <Route path="/">
        {Master ? <Master AutoRouter={AutoRouter}/> : <AutoRouter/>}
      </Route>
    </Switch>
  </Suspense>
</Router>
```

然后会执行 Master 代码，Master 在config 中可以配置。 

master.jsx

```jsx
<MasterStoreProvider>
  <Switch>
    <Route exact path={`${match.url}${match.url === '/' ? '' : '/'}error_page`} component={ErrorPage}/>
    <Route exact path={`${match.url}${match.url === '/' ? '' : '/'}undefined`} component={Empty}/>
    <Route path={match.url} component={AutoRouter}/>
  </Switch>
</MasterStoreProvider>
```

在 AutoRouter 中执行了这样代码，其作用是优先匹配 config.js 中设置的 routes 中的路由，如果匹配成功，则访问本地路由组件。

> routes 作用是一级路由与对应组件位置的描述
>
> ```bash
> # 只是本地开发
> routes: {
> a1: './src/exampleMaster/App1', # 路由为 http://192.168.20.133:9091/#/a1/
> a2: './src/exampleMaster/App2' # 路由为 http://192.168.20.133:9091/#/a2/
> }
> ```

```html
const AutoRouter = () => (
  <Suspense fallback={<Loading/>}>
    <CacheSwitch>
      {'{{ routes }}'}
      <CacheRoute path="*">
        <ExternalRoute />
      </CacheRoute>
    </CacheSwitch>
  </Suspense>
);
```

如果没有匹配成功，则执行 `<ExternalRoute />` 组件，匹配对应 remote 模块。

 `<ExternalRoute />` 组件中，根据`.env`中配置的`STATIC_URL`作为基地址，后边拼接 url 地址中的一级路由与`/importManifest.js`生成一个新的地址，类似`http://192.168.20.101:9095/a1/importManifest.js`。

然后创建一个新的`script`标签`src `填入上边生成的地址。远程拉取 importManifest.js 代码，实现 remote 模块间连接。（实现方案详情参考[动态远程容器](https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers)）

> 通常我们会有很多 remote 模块，在 host 模块访问多个 remote 模块时，我们不想在代码中把所有地址都写出来（ 类似 STATIC_URL-a1，STATIC_URL-a2 这样，会比较麻烦）。这时我可以创建一个独立的 nginx 帮我们代理。
>
> 例如所有模块都访问 `http://192.168.20.101:9095/a1/importManifest.js` ，而 192.168.20.133:9095 中设置 nginx 做对应的反向代理
>
> ```js
> # STATIC_URL 对应的 nginx
> location /a1/ { # app1 remote 模块
> 	proxy_pass http://192.168.20.101:9091/;
> }
> location /a2/ { # app2 remote 模块
> 	proxy_pass http://192.168.20.123:9092/;
> }
> ```
>
> 这样我们访问 `http://192.168.20.101:9095/a1/importManifest.js` 他会根据一级路由 `a1` 判断访问  `http://192.168.20.101:9091/a1/importManifest.js` 然后拿到 js 静态文件做对应渲染。

**总结**

代码优先执行的是 front 中的 boot 和 master 代码，然后执行到 `<ExternalRoute />` 时才会去访问 remote 模块（加载如 http://192.168.88.132:9095/app1/importManifest.js 这样的js静态文件）。
