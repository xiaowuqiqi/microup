import React from 'react';
// import CacheRoute, {CacheSwitch} from 'react-router-cache-route';
import ExternalRoute from '{{ externalRoutePath }}';
import {Route} from 'react-router-dom';

const routes = {};

function createRoute(path, lazy) {
  if (!routes[path]) {
    routes[path] = <Route
      key={path}
      path={path}
      lazy={lazy}
    />;
  }
  return routes[path];
}

// routes 如果匹配了，后边ExternalRoute就不会在匹配到了
const AutoRouter = {}
AutoRouter.getStaticRoutes = (ExternalRouteProps = {}) => {
  const staticRoutes = ['{{ routes }}']
  staticRoutes.push(<Route path='*' key='externalRoute' element={<ExternalRoute {...ExternalRouteProps}/>}/>)
  return staticRoutes
}
export default AutoRouter;
