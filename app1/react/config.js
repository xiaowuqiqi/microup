var path = require("path");

const config = {
  master: '@microUp/master',
  port: 9101,
  scopeName: 'app1',
  theme: {},
  routes: {
    app1: './react/index'
  },
  htmlTemplate: require.resolve('@microUp/master/lib/index.template.html')
};

module.exports = config;
