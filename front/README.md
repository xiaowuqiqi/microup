# @microup/front

## 前端启动

### 安装依赖

> 推荐安装 pnpm 作为包管理器，可以更快的升级我们的依赖包。

`npm i -g pnpm`

```pnpm i```

### MAC系统设置权限

```chmod -R 777 node_modules```

### 启动

```pnpm run start```

## 介绍

这是整个项目的 host 模块，生产环境运行时只有 front 会运行 master 代码，在 master 中通过一级路由分发到不同 remote 模块上。

front 包内没有任何业务代码，它只是整个项目的入口服务。

> 生产环境中 utils 包的引入是在 master 包中引入的，但是 master 不会单独起一个服务，他会附着在 front 服务上运行。
>
> ```
>   "devDependencies": {
>     "@microup/boot": ">=1.0.0-main-1.0.0 <1.0.0-main-1.0.1"
>   }
> ```

> 注意：目前 front app boot master 包中的 .env 文件不会在服务器中使用，服务器使用 nginx 启动 http 服务。
