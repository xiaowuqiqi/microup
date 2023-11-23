---
nav:
  title: util
  path: /components
---

## rootStore 方法

用于存储root运行产生的变量

代码演示:

```js
/**
 * title: 基本使用
 * defaultShowCode: true
 */
import { rootStore } from '@microup/utils';
rootStore.set('master',<dev>master</dev>)
console.log(rootStore.get('master'))
```
## API

| 属性    | 说明    | 类型       | 默认值 |
|-------|-------|----------| ------ |
| set() | 存入一个值 | function |  |
| get() | 获取一个值 | function |  |

## 其他
附录1 附录2
