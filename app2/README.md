# @microup/app2

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

这是项目中一个 remote 模块，这是一个示例，您也可以添加其他 remote 模块。

开发环境运行时执行 pnpm run start 启动一个本地服务，访问其他 remote 模块时，默认会访问到线上的remote模块。

如果您想两个或者多个 remote模块本地运行，可以设置 .env 文件

例如，你想在 app2 中访问本地的 app1，只需要在 app2 模块的 .env 文件中写入：

```
app1=http://localhost:9101
```

这里的接口也可以对应模块的 config.js 中查看与配置。config.js 与 .env 更多详情查看 boot 包的文档或者 front包文档。
