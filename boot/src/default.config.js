const path = require('path');

const tmpDirPath = path.join(__dirname, '../tmp');
module.exports.EDefaultOption = {
  src: 'react',
  lib: 'lib',
  env: 'development',
  isDev: true,
  config: 'project.config.js',
  packagePath: './package.json',
  external: false,
  exposes: {},
  tmpDirPath,
  mode: 'start',
}
module.exports.EProjectConfig = {
  port: 9090,
  theme: {
    'primary-color': '#2979FF',
    'bg-color': '#fff',
    'info-color': '#2979FF',
    'warning-color': '#FD7D23',
    'success-color': '#1AB335',
    'error-color': '#F34C4B',
    'border-color': 'fade(#CBD2DC, 50%)',
    'text-color': '#12274D',
    'heading-color': '#12274D',
    'disabled-text-color': 'fade(@text-color, 45%)',
    'disabled-bg-color': 'fade(#F2F3F5 , 60)',
  },
  output: './dist',
  htmlTemplate: 'index.template.html',
  devServerConfig: {
    hot: true,
    historyApiFallback: true,
    host: 'localhost',
  },
  browsers: [
    'last 2 versions',
    'Firefox ESR',
    '> 1%',
    'ie >= 8',
    'iOS >= 8',
    'Android >= 4',
  ],
  babelConfig(config, mode, env) {
    return config;
  },
  webpackConfig(config, mode, env) {
    return config;
  },
  entryName: 'index',

  titlename: 'microup',
  favicon: 'favicon.jpg',
  // disableParallel: false, // 压缩格式 UglifyJsPlugin TerserPlugin
  isPx2rem: false // 是否开启rem 模式
};
