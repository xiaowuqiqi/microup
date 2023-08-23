import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import {context} from '@/store'
import escapeWinPath from '@/utils/escapeWinPath';
import generateRoute from './generateRoute';

export default function generateApp() {
  const {option: {tmpDirPath}, projectConfig: {entryName}} = context;

  const appPath = path.join(tmpDirPath, `app.${entryName}.js`);

  const appTemplate = fs.readFileSync(path.join(__dirname, './nunjucks/app.nunjucks.js')).toString();

  const routesPath = escapeWinPath(generateRoute());
  const content = nunjucks.renderString(appTemplate, {
    // routeType,
    routesPath,
  });
  fs.writeFileSync(
    appPath,
    content,
  );
  return appPath;
}
