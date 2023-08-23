/* eslint-disable no-underscore-dangle */
export function getEnv(valueName, defaultValue) {
  if (typeof window !== 'undefined' && window._env_ && window._env_[valueName]) {
    return window._env_[valueName];
  }
  if (defaultValue) {
    return defaultValue;
  }
  return undefined;
}
