import webpack from 'webpack';
import path from 'path';
import fs from 'fs-extra';
// import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import Store, {context} from '@/store';
import warning from '@/utils/warning';
import generateEntry from './common/generateEntry';
import ProjectConfig from '@/store/ProjectConfig';

// function copy(fileName) {
//   const { projectConfig: { output, distBasePath } } = context;
//
//   const originPath = path.join(__dirname, '../../', fileName);
//   const distPath = path.resolve(distBasePath, output, fileName);
//   fs.copyFileSync(originPath, distPath);
// }

function checkManifest() {
  const {projectConfig: {output}, option: {external}} = context;
  if (external && !fs.existsSync(path.resolve(`${output}/importManifest.js`))) {
    warning(false, 'importManifest.js not found');
    process.exit(1);
  }
}

// function handleAfterCompile() {
//   // const distPath = path.resolve(distBasePath, output);
//   // rimraf.sync(distPath);
//   // mkdirp.sync(distPath);
//   // const COPY_FILE_NAME = ['.env', '.default.env', 'env.sh', 'env-config.js'];
//   // COPY_FILE_NAME.forEach((filename) => copy(filename));
//
//   // const originPath = path.resolve(output);
//   // fs.copySync(originPath, distPath);
//
//   // if (external) {
//   //   checkManifest(output);
//   // }
// }

export default function build(program) {
  // process.noDeprecation = true;
  // 初始化全局参数context
  const store = new Store(program, 'build', Boolean(program.dev) || false)
  store.initContext()
  const {projectConfig: {entryName, output}} = context;

  rimraf.sync(path.resolve(output));

  // generateTransfer(entryName);
  // 生成入口文件
  generateEntry(entryName);

  const webpackConfig = ProjectConfig.generateWebpackConfig(context);

  webpack(webpackConfig, (err: any, stats: any) => {
    if (err !== null) {
      // eslint-disable-next-line no-console
      console.log(err);
      warning(false, err.message);
      process.exit(1);
    } else if (stats.hasErrors()) {
      // eslint-disable-next-line no-console
      // console.log(stats);
      warning(false, stats.toString('errors-only'));
      process.exit(1);
    }
    // handleAfterCompile();
    checkManifest();
  });
}
