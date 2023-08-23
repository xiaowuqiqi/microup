# microup-utils

## 做什么

microup-utils 包是整个项目公用的组件包，项目内所有的 remote 模块（例如 app1 服务）、boot 包、master 包都会依赖这个包，也可以引用其中的工具。

**引用方式**

```js
// 引入方式了，例如引入 loading 组件
import {Loading} from '@microup/utils';
```

## 使用

首先安装依赖（推荐使用 pnpm）

```
pnpm i
```

utils 包本身使用 [dumi ](https://d.umijs.org/)搭建，运行 start 可以以在线文档形式查看当前工具库，更方便工具查询。

```
npm run start
```

打包

```
npm run compile
```

