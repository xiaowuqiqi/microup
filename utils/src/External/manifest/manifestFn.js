import {getEnv} from '../../getEnv';
import dynamicScriptFn from '../dynamic-script/dynamicScriptFn';

const cache = new Set();

export default async function manifestFn({scope}) {
  // routeMap =>{lcapp:"lch"}
  // STATIC_URL=https://static.preprod.microup.com
  const STATIC_URL = getEnv('STATIC_URL');
  const envRoute = getEnv(scope);
  const urlPrefix = `${STATIC_URL}/${scope}`;
  // envRoute 本地联调时，可以写入连接本地服务写在env内
  const {url = `${envRoute || urlPrefix}/importManifest.js`} = props;

  const script = await dynamicScriptFn({
    url,
  });
  const {ready, failed} = script;

  if (ready && !failed && !cache.has(urlPrefix)) {
    cache.add(urlPrefix);
  }

  return script;
}
