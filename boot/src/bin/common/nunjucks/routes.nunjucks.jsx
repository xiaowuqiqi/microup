import React, {Suspense} from 'react';
import CacheRoute, {CacheSwitch} from 'react-router-cache-route';
import {Loading, ExternalRoute} from '@microUp/utils';
import {Route} from 'react-router-dom';

const routes = {};

function createRoute(path, component) {
  if (!routes[path]) {
    routes[path] = <Route path={path} component={React.lazy(component)}/>;
  }
  return routes[path];
}
// routes 如果匹配了，后边ExternalRoute就不会在匹配到了
const AutoRouter = () => (
  <Suspense fallback={<Loading/>}>
    <CacheSwitch>
      {'{{ routes }}'}
      <CacheRoute path="*">
        <ExternalRoute />
      </CacheRoute>
    </CacheSwitch>
  </Suspense>
);

export default AutoRouter;
