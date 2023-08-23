var path = require("path");

const config = {
  master: '@microUp/master',
  port: 9090,
  scopeName: 'front',
  theme: {},
  routes: {},
  htmlTemplate: require.resolve('@microUp/master/lib/index.template.html')
};

module.exports = config;
