import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {inject} from 'mobx-react';
import {Empty} from '@microup/master';

const Page1 = React.lazy(() => import('./routes/Page1'));
const Page2 = React.lazy(() => import('./routes/Page2'));

function Index({match, masterStore}) {
  return (
    <Switch>
      <Route exact path={`${match.url}/page1`} component={Page1}/>
      <Route exact path={`${match.url}/page2`} component={Page2}/>
      <Route exact path={`${match.url}`} component={Page1}/>
      <Route path="*" component={Empty}/>
    </Switch>
  );
}

export default inject('masterStore')(Index);
