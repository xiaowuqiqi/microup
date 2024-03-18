var path = require("path");
const scopeName = 'front'
const config = {
  master: '@microup/master',
  port: 9090,
  scopeName,
  theme: {},
  routes: {},
  output: `./dist`,
  htmlTemplate: require.resolve('@microup/master/lib/index.template.html'),
  favicon: require.resolve('@microup/boot/lib/favicon.jpg'),
  sharedModules:{
    '@microup/utils': {
      singleton: true,
      requiredVersion: false,
    },
    '@microup/master': {
      singleton: true,
      requiredVersion: false,
    },
  },
};

module.exports = config;
