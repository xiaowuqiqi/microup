---
title: External
nav:
  title: util
---
# External
## loadComponent

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



## useDynamicScript、useManifest

模块联邦组件内，创建script标签方法。

useDynamicScript 使用方法。

```js
import { useDynamicScript } from '@microup/utils';  
const script = useDynamicScript({
   url,
});
```

useManifest 在 ExternalComponent 组件中被引用。

```jsx | pure
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { loadComponent, useManifest } from '@microup/utils';
import {Loading} from '../Loading';

const cache = new Map();

function getComponent({ scope, module }, ErrorComponent = null) {
  const scopeItem = cache.get(scope) || new Map();
  cache.set(scope, scopeItem);
  const component = scopeItem.get(module);
  if (component) {
    return component;
  }
  const lazyComponent = React.lazy(
    loadComponent(scope, module, (error) => {
      console.error(error);
      return {
        default: () => ErrorComponent,
      };
    }),
  );
  scopeItem.set(module, lazyComponent);
  return lazyComponent;
}

function ExternalComponent(props) {
  const { system, notFound, ErrorComponent, fallback = <Loading /> } = props;
  const { ready, failed } = useManifest(system);

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (failed) {
    return notFound || <span />;
  }

  if (!ready) {
    return fallback || <Loading />;
  }

  const Component = getComponent(system, ErrorComponent);

  return (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
}

export default ExternalComponent;

```

