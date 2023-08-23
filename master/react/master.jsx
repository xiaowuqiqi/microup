import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {MasterStoreProvider} from './store';

const ErrorPage = React.lazy(() => import('./tools/ErrorPage'))
const Empty = React.lazy(() => import('./tools/Empty'))

const InnerIndex = (props) => {
  const {match, AutoRouter} = props
  return (
    <MasterStoreProvider>
      <Switch>
        <Route exact path={`${match.url}${match.url === '/' ? '' : '/'}error_page`} component={ErrorPage}/>
        <Route exact path={`${match.url}${match.url === '/' ? '' : '/'}undefined`} component={Empty}/>
        <Route path={match.url} component={AutoRouter}/>
      </Switch>
    </MasterStoreProvider>
  )
};

export default withRouter(InnerIndex);
