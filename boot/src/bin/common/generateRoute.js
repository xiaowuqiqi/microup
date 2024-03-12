import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import {context} from '@/store'
import escapeWinPath from '@/utils/escapeWinPath';
import ProjectConfig from "@/store/ProjectConfig";

const routesTemplate = fs.readFileSync(path.join(__dirname, './nunjucks/routes.nunjucks.js')).toString();
export default function generateRoute() {
  const {option: {tmpDirPath, bootRootPath, lib}, projectConfig: {entryName}} = context;
  const configRoutes = ProjectConfig.getRoutes(context);
  const routesPath = path.join(tmpDirPath, `routes.${entryName}.js`);
  const externalRoutePath = path.join(bootRootPath, lib, `utils/ExternalRoute/index.js`);
  nunjucks.configure(routesPath, {
    autoescape: false,
  });
  // const homePathStr = `createHome("/", ${homePath ? `function() { return import("${escapeWinPath(path.resolve(homePath || ''))}"); }` : null}, ${homePath ? `'${homePath}'` : homePath})`;
  fs.writeFileSync(
    routesPath,
    nunjucks.renderString(routesTemplate, {
      externalRoutePath: escapeWinPath(externalRoutePath),
      routes: Object.keys(configRoutes).length ? Object.keys(configRoutes).map((key) => (
        `createRoute("${key}/*", async () => {let _C = await import("${escapeWinPath(configRoutes[key])}");return {Component:_C.default};})`
      )).join(',\n') : 'null',
      // home: homePathStr,
      // source: isDev ? 'src' : 'lib',
      // name: entryName,
    }),
  );
  return routesPath;
}
