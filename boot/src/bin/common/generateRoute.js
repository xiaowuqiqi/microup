import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import {context} from '@/store'
import escapeWinPath from '@/utils/escapeWinPath';
import ProjectConfig from "@/store/ProjectConfig";

const routesTemplate = fs.readFileSync(path.join(__dirname, './nunjucks/routes.nunjucks.js')).toString();

export default function generateRoute() {
  const {option: {tmpDirPath}, projectConfig: {entryName}} = context;
  const configRoutes = ProjectConfig.getRoutes(context);
  const routesPath = path.join(tmpDirPath, `routes.${entryName}.js`);
  nunjucks.configure(routesPath, {
    autoescape: false,
  });
  // const homePathStr = `createHome("/", ${homePath ? `function() { return import("${escapeWinPath(path.resolve(homePath || ''))}"); }` : null}, ${homePath ? `'${homePath}'` : homePath})`;
  fs.writeFileSync(
    routesPath,
    nunjucks.renderString(routesTemplate, {
      routes: Object.keys(configRoutes).length ? Object.keys(configRoutes).map((key) => (
        `createRoute("/${key}", function() { return import("${escapeWinPath(configRoutes[key])}"); })`
      )).join(',\n') : 'null',
      // home: homePathStr,
      // source: isDev ? 'src' : 'lib',
      // name: entryName,
    }),
  );
  return routesPath;
}
