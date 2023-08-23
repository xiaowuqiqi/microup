import React from 'react';
import {observer} from 'mobx-react-lite';
import {withRouter, Route, Switch} from 'react-router-dom';
import {ExternalComponent} from '../ExternalComponent';

const routes = new Map();
// 例子 http://localhost:9099/#/ccs/agent_management?solutionId=268868907647893504&tenantId=207965165382135808
export const ExternalRoute = withRouter(observer((props) => {

  // pathname => /ccs/agent_management
  // match => {
  //    isExact:true
  //    params:{0: '/ccs/agent_management'}
  //    path:"*"
  //    url:"/ccs/agent_management"
  // }
  const {location: {pathname}, match} = props;
  // routeName => ccs
  const routeName = pathname.match(/^\/([^/]*)/)[1];
  // url => /ccs
  const url = `/${routeName}`;
  if (!routes.has(url) && routeName) {
    routes.set(url, [{
      scope: routeName,
      module: `./${routeName}`,
    }, {...match, url}]);
  }
  // path => /ccs
  // system => {
  //    module: "./ccs"
  //    scope: "ccs"
  // }
  // computedMatch => match
  return (
    <Switch>
      {
        [...routes.entries()].map(([path, [system, computedMatch]]) => {
          return (
            <Route path={path} key={path} cacheKey={path}>
              <div data-scope={routeName}>
                <ExternalComponent system={system} {...props} match={computedMatch}/>
              </div>
            </Route>
          );
        })
      }
    </Switch>
  );
}));
