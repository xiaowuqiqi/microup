import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import {ExternalComponent} from '@microup/utils';

const routes = new Map();
// 例子 http://localhost:9099/#/ccs/agent_management?solutionId=268868907647893504&tenantId=207965165382135808
export default function ExternalRoute(props) {
  // pathname => /ccs/agent_management
  let {pathname} = useLocation();
  // let match = useRouteMatch();
  // routeName => ccs
  const routeName = pathname.match(/^\/([^/]*)/)[1];
  // url => /ccs
  const url = `/${routeName}`;
  if (!routes.has(url) && routeName) {
    routes.set(
      url,
      {
        scope: routeName,
        module: `./${routeName}`,
      }
    );
  }
  // path => /ccs
  // system => {
  //    module: "./ccs"
  //    scope: "ccs"
  // }
  return (
    <Routes>
      {
        [...routes.entries()].map(([_url, system]) => {
          return (
            <Route
              path={_url + '/*'}
              key={_url}
              // cacheKey={path}
              element={
                <ExternalComponent system={system} {...props}/>
              }
            >
              {ExternalComponent.getStaticRoutes && ExternalComponent.getStaticRoutes(_url, system)}
            </Route>
          );
        })
      }
    </Routes>
  );
};
