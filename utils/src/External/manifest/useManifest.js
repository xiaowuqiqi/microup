import {useEffect} from 'react';
import {getEnv} from '../../getEnv';
import useDynamicScript from '../dynamic-script/useDynamicScript';

const cache = new Set();

export default function useManifest(props) {
  const {scope} = props;
  // routeMap =>{lcapp:"lch"}
  // STATIC_URL=https://static.preprod.microup.com
  const STATIC_URL = getEnv('STATIC_URL');
  const envRoute = getEnv(scope);
  const urlPrefix = `${STATIC_URL}/${scope}`;
  // envRoute 本地联调时，可以写入连接本地服务写在env内
  const {url = `${envRoute || urlPrefix}/importManifest.js`} = props;

  const script = useDynamicScript({
    url,
  });
  const {ready, failed} = script;

  useEffect(() => {
    if (ready && !failed && !cache.has(urlPrefix)) {
      cache.add(urlPrefix);
    }
  }, [urlPrefix, ready, failed]);

  return script;
}
