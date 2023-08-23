import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {inject} from 'mobx-react';
import {Empty} from '@microUp/master';
import {ErrorBoundary} from "react-error-boundary";

const Page1 = React.lazy(() => import('./routes/Page1'));
const Page2 = React.lazy(() => import('./routes/Page2'));

const App = inject('masterStore')(({match, masterStore}) => {
  return (
    <Switch>
      <Route path={`${match.url}/page1`} component={Page1}/>
      <Route path={`${match.url}/page2`} component={Page2}/>
      <Route path={`${match.url}`} component={Page1}/>
      <Route path="*" component={Empty}/>
    </Switch>
  );
})

export default function (props) {
  return (
    <ErrorBoundary
      fallback={<div>error</div>}
    >
      <App {...props}/>
    </ErrorBoundary>
  )
}
