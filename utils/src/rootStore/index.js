import React from 'react';

export const rootStore = {data: {}}

rootStore.set = (key, value) => {
  rootStore.data[key] = value
}

rootStore.has = (key) => {
  return rootStore.data[key] !== undefined && rootStore.data[key] !== null
}

rootStore.get = (key) => {
  return rootStore.data[key]
}
