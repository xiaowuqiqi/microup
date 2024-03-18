var path = require("path");
const scopeName = 'app2'
const config = {
  master: '@microup/master',
  port: 9102,
  scopeName,
  theme: {},
  routes: {
    [scopeName]: './react/index'
  },
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
