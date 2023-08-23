import "core-js";
import React, {Suspense} from 'react';
import {HashRouter as Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Loading, rootStore} from '@microup/utils';
import {Route, Switch} from 'react-router-dom';

if (typeof process === 'undefined' && typeof window !== 'undefined' && !window.import) {
  window.import = require('dimport/legacy');
}
if (typeof process === 'undefined') {
  window.process = {env: {}};
}

const AutoRouter = React.lazy(() => import('{{ routesPath }}'));

const getConfirmation = (message, callback) => {
  // const [title, content] = message.split('__@.@__');
  // Modal.confirm({
  //   className: 'c7n-iam-confirm-modal',
  //   title: content && title,
  //   children: content || title,
  //   onOk() {
  //     callback(true);
  //   },
  //   onCancel() {
  //     callback(false);
  //   },
  // });
};

const App = () => {
  const Master = rootStore.get('Master');
  return (
    <Router hashHistory={createBrowserHistory} getUserConfirmation={getConfirmation}>
      <Suspense fallback={<Loading/>}>
        <Switch>
          <Route path="/">
            {Master ? <Master AutoRouter={AutoRouter}/> : <AutoRouter/>}
          </Route>
        </Switch>
      </Suspense>
    </Router>
  )
};

export default App;
