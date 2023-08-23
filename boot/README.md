# microUp Boot

## 安装依赖

> 推荐安装 pnpm 作为包管理器，可以更快的升级我们的依赖包。

```
npm i -g pnpm
pnpm i
```

MAC系统设置权限

```
chmod -R 777 node_modules
```

启动

```
pnpm start
```

## 简介

microUp 基础的 cli 工具包，负责对master、front、app包的打包，对这些包的js，css文件进行压缩与编译工作，最终生成微前端服务的镜像。

这个包基于 webpack5 模块联邦开发，共享 boot 与目标包 dependencies 中的依赖，公开目标包内注册的[动态远程容器](https://www.webpackjs.com/concepts/module-federation/#dynamic-remote-containers)组件，共其他 remote 模块使用。

负责目标包的基础路由解析，通过一级路由代理到不同 remote 模块，开发时也可以指定访问线上或本地其他 remote 模块。

负责管理整个项目的一些依赖包，比如 react，mobx 等包都会注册在 boot 的 dependencies 中。

## 配置

### .env

在使用boot打包或者启动项目时，可以在.env中配常量，这些常量将最终写入`window._env_`变量中，可全局访问。

**使用这些常量**：

```js
import {getEnv} from '@microUp/utils';
const STATIC_URL = getEnv('STATIC_URL');
```

**一些特殊常量**：

```bash
API_HOST=https://***.***.com # 后端接口地址
STATIC_URL=http://192.168.**.***:9095 # 前端静态服务地址
****=http://localhost:**** # 本地调试时，连接本地的其他 remote 模块
# 例如：app2=http://localhost:9101
```

### config.js

在使用 boot 打包或者启动项目时，可以在config.js中配置 boot 的一些配置。

```js
{
  master: '@microUp/master', // master 目录地址
  port: 9101, // 本地运行端口
  scopeName: 'app1', // 属性则是 remote 模块的 scope 标识
  titlename: 'microUp', // 设置浏览器标签页标题，也可以在启动时传入 TITLE_NAME 设置标题（cross-env GENERATE_SOURCEMAP=true）
  favicon: 'favicon.jpeg', // 设置浏览器标签页图标
  routes: { // 配置项目一级路由对
    app1: './react/index'
  },
  theme: { // 注入全局样式变量
    'primary-color': '#2979FF',
  },
  htmlTemplate: require.resolve('@microUp/master/lib/index.template.html') // 设置 html 模板文件的地址
  webpackConfig(config) { // 设置webpack的配置，例如设置别名
    config.resolve.alias = {
      ...config.resolve.alias || {},
      [packageName]: path.resolve('.'),
      '@': path.resolve('./src'),
    };
    return config;
  },
  
  isDev: true, // 设置是否以 development|production 模式打包或启动，在打包时也可以使用 --dev true 设置为 development 模式
  ///////////////下边属性不常用////////////
  src: 'react', // 组件主体代码对应目录
  lib: 'lib', // compile 打包对应目录名（一般固定lib）
  output: './dist',// dist 打包目录名字
  exposes: {}, // 对外公开远程模块
  babelConfig(config, mode, env) { // babel 配置钩子
    return config;
  },
  tmpDirPath: path.join(__dirname, '../tmp'), // tmp 文件地址
  devServerConfig: { // 本地运行时，服务器配置
    hot: true,
    historyApiFallback: true,
    host: 'localhost',
  },
  browsers: [ // 浏览器兼容配置
    'last 2 versions',
    'Firefox ESR',
    '> 1%',
    'ie >= 8',
    'iOS >= 8',
    'Android >= 4',
  ],
  isPx2rem: false // 是否开启rem 模式
}
```

**routes**

其中 **routes** 属性配置项目一级路由对应目录，每个模块中都需要有一个 scopeName 对应的一级路由，以便作为 remote 模块时可以做模块的路由入口。

例如本次案例中 scopeName 为 app1 ，则路由中也需要设置 app1 对应目录。

```js
scopeName: "app1"
routes: { // 配置项目一级路由对
	app1: './react/index'
},
```

这里 app1 在 url 中可以被 http://***:***/#/app1/ 匹配，例如：被`http://192.168.20.133:9091/#/a1/`匹配。

**scopeName** 

而 **scopeName** 属性则是 remote 模块的 scope 标识，当前模块作为 remote 模块时，被 host 模块引用可以使用 ExternalComponent 组件加载。

例如 app2 中使用 app1 的组件：

```jsx
import {ExternalComponent} from '@microUp/utils';

<ExternalComponent
   system={{
      scope: 'app1', module: 'App1EC',
   }}
/>
```

被引用组件 App1EC 则需要使用`/* externalize: App1EC */`注册在 app1 内：

```jsx
import React from 'react';

export default function (props) {
  return (<div>app1-externalize-components</div>);
}
/* externalize: App1EC */
```

任意组件都可以写入`/* externalize: App1EC */`，写入后其他模块都可以使用 ExternalComponent 组件访问。

## 指令

boot 包常用指令有 pnpm run compile 和 pnpm run start:bin

### compile

使用 gulp 打包 master 与 boot 包内文件到 lib 目录，这里只通过 babel 编译，不进行压缩操作。然后通过 `npm publish` 命令把 lib 目录打包发往私有库中。

### start:bin

通过 webpack dev server 开启一个本地 http 服务示例，用于测试当前 boot 包。

根据 project.config.js 文件中路由配置开启这个服务示例。

boot 包内的服务示例写于 exampleMaster 中，该目录只在开发环境加载使用，执行 compile 时会过滤这个目录中的内容。线上环境则不在需要。

配置项 `master: './src/exampleMaster'` 作用是服务示例所用 master 文件的位置，master 负责全局状态管理，权限校验，路由重定向等功能。

配置项 routes 作用是一级路由与对应组件位置的描述

```bash
# 只是本地开发
routes: {
  a1: './src/exampleMaster/App1',
  a2: './src/exampleMaster/App2'
},
```

## 目录

目录解析

```bash
boot
|-bin # nodeJs 命令行实现方案
|-lib # 执行 compile 后生产的打包目录
|-src # 
|  |--bin # webpack 配置目录
|  |--exampleMaster # 服务示例代码，用于测试 boot 包
|  |--store # boot 状态管理目录，仅用于 boot 内部
|  |--utils # 一些 boot 的全局方法
|  |--.env # 本地运行时服务参数配置
|  |--default.config.js # 默认 boot 配置，主要是外放的 webpack 一些配置
|  |--index.template.html # 本地运行时 html 模板
|-tmp # entry入口目录，打包时自动生成，加载 Master 组件
|-gulpfile.js # boot compile 指令运行内容，负责对 src 打包工作
|-project.config.js # 本地运行 start:bin 时，根据这个配置启动一个 host 模块
```

### bin目录

该目录存储 boot 作为 cli 可运行的指令，有 `micro-up-boot start`、`micro-up-boot dist`、`micro-up-boot compile`、`micro-up-boot compile`。

#### stert

开启一个开发环境，主要用于前端开发时使用。

参数有`-c|--config`设置 boot 配置文件目录。

参数有`-s|--src`设置跟组件对应目录，默认目录是`react`，src 配置项优先获取指令上的变量参数，如果没有设置，则会获取 config.js 文件中设置的 src 项。

参数有`-l|--lib`设置 boot 打包后的目录名，通常无需设置

例如：app1设置开启本地运行的开发环境 host 模块

```json
"scripts": {
	"start": "micro-up-boot start --config ./react/config.js",
},
```

#### dist

用于app、front包的打包，该指令不用于 master、boot包打包。

基本参数同上，在此基础多出`-d|--dev`参数，在生产环境打包无需开启，如果需要测试或打开发环境代码包时设置为 treu 即可。

```json
"scripts": {
	"dist:dev": "micro-up-boot dist --config ./react/config.js --dev true"
},
```

#### compile

目前仅用于 master 打包，打出 master 的lib 包。

#### prePublish

用于修改 package.json 中的版本属性。

使其改为这样的示例格式`0.0.1-dev-0.0.1.20230810182951`。

后边 20230810182951 这串数字是当前时间精确到秒，保证每次打包都会有新的版本产生，部署时可以根据排序优先选择最大时间的对应包；并且 master 包引用时可以使用范围定义：`"@microUp/boot": ">=1.0.0-main-1.0.0 <1.0.0-main-1.0.1"`保证每次`pnpm update @microUp/boot`都可以下载到最新的boot包。

注：该指令目前已经废弃，这个功能已在ci的脚本中实现。

### src目录

boot 包主要代码，主要对webpack的配置与开发。

#### 生成tmp

tmp 目录由 [Nunjucks](https://mozilla.github.io/nunjucks/) 模板文件自动生成，是 webpack 入口，作用是加载 Master 组件， 以及分发 routes 路由与访问 remote 模块。

在src/bin/common 目录下`generateApp.js`、`generateEntry.js`、`generateEnvironmentVariable.js`、`generateRoute.js`文件代码通过 [Nunjucks](https://mozilla.github.io/nunjucks/) 模板引擎，根据 `nunjucks` 中的模板生成对应的 jsx 文件，放于 tmp 目录中。

前端模块，在执行 dist 和 stert 指令时，tmp 在 node_modules/@microUp/boot 目录下都会生成。

> 路由处理详情，请查看 master 包内文档。

#### 加载 Master 组件

webpack加载第一个文件是 tmp/bootstrap.index.js 它只有一句代码`import('./{{ bootstrap }}')` 起作用是解决`Shared module is not available for eager consumption`错误以及拆分出更大块的初始化代码。（[详情参考](https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption)）

然后在 tmp/app.index.js 中会渲染 Master组件。

```react
{Master ? <Master AutoRouter={AutoRouter}/> : <AutoRouter/>}
```

Master 组件根据 config.js 中配置的路径查找组件，通常都是指向`'@microUp/master'`包，boot 包除外。

```
master: '@microUp/master', // 非 boot
master: './src/exampleMaster', // boot
```

#### webpack配置

webpack 配置代码主要位于`src/common/config/getWebpackCommonConfig.js`中，主要处理： babel 对 js 代码编译与压缩、less 模块化与编译、ts配置注入与编译、全局样式变量注入、全局env数据注入、sourceMap、模块联邦这些工作。

#####  babel js代码编译

babel 配置代码的文件位于`src/bin/common/config/getBabelCommonConfig.js`中。

目前babel 版本为 7；使用`preset-env`和`preset-react`预设；useBuiltIns 模式默认使用 `entry` ，在 app.nunjucks.jsx 中使用 `import "core-js"`全量引入 core-js；core-js 版本默认使用 3.29.1。

> 注：@babel/polyfill 已被弃用，交由`core-js`处理（[详情参考](https://babel.dev/docs/babel-polyfill)）。

> 注：useBuiltIns 模式默认没有使用 usage ，为避免扩展其他包时 polyfill 失效，如切换 usage 模式，需要删掉 app.nunjucks.jsx 中的 `import "core-js"`。

##### less 模块化

webpack 配置中，使用 oneOf 匹配命名 .module.less 结尾与 .less 结尾的文件，根据命名中是否有 module 判断是否开启 modules 。

开启 less 模块化后，可以使用变量引入方式添加样式例如:

```react
// index.module.less
.red {
  color: red;
}
// index.jsx
import classnames from 'classnames'
import styles from './index.module.less'
export default withRouter((props) => {
  return (
    <div>
      <div className={classnames(styles.red)}>master</div>
    </div>
  );
})
```

##### 全局样式变量注入

样式变量通过 lessOptions.modifyVars 注入，如果需要js处理的动态样式变量也可以使用 [`@plugin` ](https://lesscss.org/features/#plugin-atrules-feature)

默认样式变量包括一些主题颜色与提示颜色，这个配置位于 src/default.config.js 中。

```
  theme: {
    'primary-color': '#2979FF',
    'bg-color': '#fff',
    'info-color': '#2979FF',
    'warning-color': '#FD7D23',
    'success-color': '#1AB335',
    'error-color': '#F34C4B',
    'border-color': 'fade(#CBD2DC, 50%)',
    'text-color': '#12274D',
    'heading-color': '#12274D',
    'disabled-text-color': 'fade(@text-color, 45%)',
    'disabled-bg-color': 'fade(#F2F3F5 , 60)',
  },
```

如需要在特定模块添加样式变量时，也可以在 host 模块启动前修改修改 config.js 文件，做 theme 的覆盖

```json
const config = {
  master: '@microUp/master',
  port: 9101,
  scopeName: 'app1',
  theme: { // 覆盖或添加当前模块的样式变量
  	'text-color2': '#12274D',
  },
  routes: {
    app1: './react/index'
  },
  htmlTemplate: require.resolve('@microUp/master/lib/index.template.html')
};
```

样式变量在引用时，可以直接使用 @ 引入：

```less
.red {
  color: @primary-color;
}
```

##### env数据注入

env数据处理的代码位置位于 src/bin/common/generateEnvironmentVariable.js 中，获取当前模块 .env 文件数据与 boot 包中 .default.env 文件据做融合，生成 env-config.js 文件，运行后注入到 window.\_env\_ 中。

```js
// generateEnvironmentVariable.js 中
const combineEnv = {
	NODE_ENV: JSON.stringify(env),
    ...defaultEnv.parsed,
	...customEnv.parsed,
};
fs.writeFileSync(
	envConfigPath,
	`window._env_ = ${JSON.stringify(combineEnv)};`,
);

// 生成的 env-config.js 文件
window._env_ = {"NODE_ENV":"\"development\"","API_HOST":"https://api.test.yqcloud.com","LOCAL":"true","TITLE_NAME":"micorUp","COOKIE_SERVER":"localhost:cookieServer","FILE_SERVER":"localhost:fileserver","STATIC_URL":"http://192.168.20.133:9095","app1":"http://localhost:9101"};
```

##### sourceMap

默认情况下运行 start 指令时开启 sourceMap，运行 dist 打包时关闭 sourceMap。如果需要手动设置开启，也可以传入 GENERATE_SOURCEMAP 变量开启

```bash
"scripts": {
	"dist:bin": "cross-env GENERATE_SOURCEMAP=true node bin/micro-up-boot dist --config ./project.config.js -s src"
}
```

##### alias

在 config.js 配置文件中可以设置别名。

```js
webpackConfig(config) {
	config.resolve.alias = {
  		...config.resolve.alias || {},
  		[packageName]: path.resolve('.'),
  		'@': path.resolve('./src'),
	};
	return config;
},
```

别名设置后在 js 文件中使用

```js
import styles2 from '@/exampleMaster/index.module.less'
```

别名设置后在 less 文件中使用，@ 前边需要加上 ~ 符号。

```less
@import '~@/exampleMaster/admin.less';
```

##### 模块联邦（Module Federation）

**exposes 属性**

可以允许 host 在运行时通过公开远程模块的方法来设置远程模块的 publicPath。（[详情参考](https://www.webpackjs.com/concepts/module-federation/)）

**exposes 属性注入方式：**

主要通过 getExternalizeExposes() 方法公开远程模块。

其次 config 注册的 routes 也将公开成为远程模块，这也是微前端实现 remote 模块间连接的重要步骤。

也可以在 config.js 中传入 exposes 属性，注入外放模块。

**getExternalizeExposes 工作：**

getExternalizeExposes 方式主要通过扫描文件中 externalize:** 注释（例如：`/* externalize: App2EC */`）注册外放组件。在每次打包 remote 模块时都会扫描模块内的 externalize 组件，注册后，在 host 模块中，可以使用 ExternalComponent 组件引入注册的组件。

```jsx
// remote 模块中（app2）
export default function (props) {
  console.log(props)
  return (<div>app2-externalize-components</div>);
}
/* externalize: App2EC */

// host 模块中
<ExternalComponent
   system={{
      scope: 'app2', module: 'App2EC',
   }}
/>
```



