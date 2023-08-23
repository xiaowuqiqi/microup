var path = require("path");

const config = {
  master: '@microup/master',
  port: 9090,
  scopeName: 'front',
  theme: {},
  routes: {},
  htmlTemplate: require.resolve('@microup/master/lib/index.template.html')
};

module.exports = config;
