---
title: loadComponent
nav:
  title: util

---

# loadComponent

ExternalComponent组件引用，用于联邦组件获取渲染某个节点。

```js
import {loadComponent} from '@microup/utils';
 const lazyComponent = React.lazy(
    loadComponent(scope, module, (error) => {
      console.error(error);
      return {
        default: () => ErrorComponent,
      };
    }),
  );
```

| 入参    | 介绍     | 类型     |
| ------- | -------- | -------- |
| scope   | 模块名称 | string   |
| module  | 组件名称 | string   |
| onError | 报错处理 | Function |



