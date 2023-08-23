import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {inject} from 'mobx-react';
import {ErrorPage} from '@microup/master';

const Page1 = React.lazy(() => import('./routes/Page1'));
const Page2 = React.lazy(() => import('./routes/Page2'));

function Index({match, masterStore}) {
  return (
    <Switch>
      <Route path={`${match.url}/page1`} component={Page1}/>
      <Route path={`${match.url}/page2`} component={Page2}/>
      <Route path="*" component={ErrorPage}/>
    </Switch>
  );
}

export default inject('masterStore')(Index);
