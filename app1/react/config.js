var path = require("path");

const config = {
  master: '@microup/master',
  port: 9101,
  scopeName: 'app1',
  theme: {},
  routes: {
    app1: './react/index'
  },
  htmlTemplate: require.resolve('@microup/master/lib/index.template.html'),
  favicon: require.resolve('@microup/boot/lib/favicon.jpg')
};

module.exports = config;
