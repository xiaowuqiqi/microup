import fs from 'fs';
import path from 'path';
import {context} from '@/store'


function parse(src, options) {
  const debug = Boolean(options && options.debug);
  const obj = {};

  src.toString().split('\n').forEach((line, idx) => {
    const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (keyValueArr != null) {
      const key = keyValueArr[1];

      let value = keyValueArr[2] || '';

      const len = value ? value.length : 0;
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }

      value = value.replace(/(^['"]|['"]$)/g, '').trim();

      obj[key] = value;
    } else if (debug) {
      // eslint-disable-next-line no-console
      console.log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
    }
  });

  return obj;
}

function config(options) {
  let dotenvPath = path.resolve('.env');
  let encoding = 'utf8';
  let debug = false;

  if (options) {
    if (options.path != null) {
      dotenvPath = options.path;
    }
    if (options.encoding != null) {
      // eslint-disable-next-line prefer-destructuring
      encoding = options.encoding;
    }
    if (options.debug != null) {
      debug = true;
    }
  }

  try {
    const parsed = parse(fs.readFileSync(dotenvPath, {encoding}), {debug});
    return {parsed};
  } catch (e) {
    return {error: e};
  }
}

/**
 * 通过node模拟shell脚本生成环境变量文件(env-config.js)过程
 * 检查本地是否有环境变量文件，如果有，复制都boot根目录下
 * 解析用户环境变量文件和默认环境变量文件
 * 进行合并
 */
export function generateEnvironmentVariable() {
  const {option: {env, src}} = context;
  const customEnvPath = path.resolve(src, './.env');
  const dirEnvPath = path.join(__dirname, '../../..', '.env');
  if (fs.existsSync(customEnvPath)) {
    fs.copyFileSync(customEnvPath, dirEnvPath);
  }

  const customEnv = config({path: dirEnvPath,
  });

  const defaultEnv = config({
    path: path.join(__dirname, '../../..', '.default.env'),
  });
  const combineEnv = {
    NODE_ENV: JSON.stringify(env),
    ...defaultEnv.parsed,
    ...customEnv.parsed,
  };

  const envConfigPath = path.join(__dirname, '../../..', 'env-config.js');

  fs.writeFileSync(
    envConfigPath,
    `window._env_ = ${JSON.stringify(combineEnv)};`,
  );
  return `window._env_ = ${JSON.stringify(combineEnv)};`;
}
