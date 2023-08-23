const path = require('path');
const packagePath = './package.json';
const packageName = require(path.resolve(packagePath)).name.replace('/', '-');

module.exports = {
  port: 9090,
  master: './src/exampleMaster',
  scopeName: 'boot',
  routes: {
    a1: './src/exampleMaster/App1',
    a2: './src/exampleMaster/App2'
  },
  packagePath,
  // modules: [
  //   '.',
  // ],
  // emailBlackList: 'qq',
  // resourcesLevel: ['site', 'user'],
  webpackConfig(config) {
    config.resolve.alias = {
      ...config.resolve.alias || {},
      [packageName]: path.resolve('.'),
      '@': path.resolve('./src'),
    };
    return config;
  },
};
