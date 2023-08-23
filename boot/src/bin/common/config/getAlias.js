const path = require('path');
/**
 * 别名替换，可以设置js、ts、style中的别名
 * */
const alias = {
  '@': './react',
};


module.exports = Object.entries(alias) // entries 把对象以数组的形式遍历
  .reduce((map, [key, value]) => {
      map.style[`~${key}/`] = `${value}/`;
      map.webpack[key] = path.resolve(value);
      return map;
    }, {
      babel: alias,
      style: {},
      webpack: {} // webpack 中设置别名
    }
  );
