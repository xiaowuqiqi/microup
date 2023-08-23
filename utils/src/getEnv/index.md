---
title: getEnv
nav:
  title: util

---

# getEnv

获取env数据 window._env_[valueName]

```js
import { getEnv } from '@microup/utils';
const API_HOST = getEnv('API_HOST', '');
```

| 入参         | 介绍         | 类型   |
| ------------ | ------------ | ------ |
| valueName    | 变量名       | string |
| defaultValue | 默认返回数据 | string |



