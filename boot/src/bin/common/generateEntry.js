import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import {context} from '@/store'
import ProjectConfig from '@/store/ProjectConfig'
import escapeWinPath from '@/utils/escapeWinPath';
import absolutePath from '@/utils/absolutePath';
import generateApp from './generateApp';

export default function generateEntry() {
  const {option: {tmpDirPath, external, mode}, projectConfig: {master, entryName}} = context;
  // 生成主入口文件
  const entryPath = path.join(tmpDirPath, `entry.${entryName}.js`);
  const bootstrapPath = path.join(tmpDirPath, `bootstrap.${entryName}.js`);
  if (external && mode !== 'start') {
    const entryTemplate = fs.readFileSync(path.join(__dirname, './nunjucks/external.nunjucks.js')).toString();
    fs.writeFileSync(entryPath, nunjucks.renderString(entryTemplate, {
      main: escapeWinPath(ProjectConfig.getRouteVal(context)),
    }),);
  } else {
    const entryTemplate = fs.readFileSync(path.join(__dirname, './nunjucks/entry.nunjucks.js')).toString();
    nunjucks.configure({autoescape: false});
    fs.writeFileSync(entryPath, nunjucks.renderString(entryTemplate, {
      appPath: escapeWinPath(generateApp()),
      // 这里master是'@microup/apps-master' ，走require.resolve 在 node_modules 中找
      // 这里master是'./react' ，走path.resolve 在 D:/work/microup/microup-front-master/react 中找（master中）
      master: escapeWinPath(absolutePath(master)) || '',
    }),);
  }
  const bootstrapTemplate = fs.readFileSync(path.join(__dirname, './nunjucks/bootstrap.nunjucks.js')).toString();
  fs.writeFileSync(
    bootstrapPath,
    nunjucks.renderString(bootstrapTemplate, {
      bootstrap: `entry.${entryName}.js`,
    }),
  );
}
