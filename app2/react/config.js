var path = require("path");

const config = {
  master: '@microup/master',
  port: 9102,
  scopeName: 'app2',
  theme: {},
  routes: {
    app2: './react/index'
  },
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
