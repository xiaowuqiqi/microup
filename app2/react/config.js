var path = require("path");

const config = {
  master: '@microUp/master',
  port: 9102,
  scopeName: 'app2',
  theme: {},
  routes: {
    app2: './react/index'
  },
  htmlTemplate: require.resolve('@microUp/master/lib/index.template.html')
};

module.exports = config;
