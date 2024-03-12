// import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import openBrowser from 'react-dev-utils/openBrowser';
import Store, {context} from '../store'
import ProjectConfig from '../store/ProjectConfig'
// import DevServerOptionsItem from '../store/DevServerOptionsItem'
// import generateTransfer from './common/generateTransfer';
import generateEntry from './common/generateEntry';
// import generateWebpackConfig from './common/generateWebpackConfig';
// import generateEnvironmentVariable from './common/generateEnvironmentVariable';
// import getWebpackCommonConfig from './common/config/getWebpackCommonConfig';

export default function start(params, done) {
  // 初始化全局参数 context
  const store = new Store(params, 'start', !done)
  store.initContext()
  // entryName => index
  const {projectConfig: { devServerConfig, port}} = context;// 默认值分别为 index {} 端口号
  // generateTransfer(entryName);
  // 生成入口文件
  generateEntry();

  const webpackConfig = ProjectConfig.generateWebpackConfig(context)
  const compiler = webpack(webpackConfig);
  console.log('devServerConfig',devServerConfig)
  const server = new WebpackDevServer(devServerConfig,compiler);
  server.listen(
    port, '0.0.0.0',
    () => {
      openBrowser(`http://localhost:${port}`);
      if (done) {
        done();
      }
    },
  );
}
