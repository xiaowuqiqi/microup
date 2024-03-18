import React from 'react';
import {Route, Routes} from "react-router-dom";
import {asyncLazy} from '@microup/utils';
import {inject} from 'mobx-react';
// import * as serviceWorkerRegistration from '@microup/master/lib/serviceWorkerRegistration';

export default inject('masterStore')((props) => {
  return (
    <Routes>
      <Route index element={asyncLazy(()=>import('./routes/Page1'))}/>
      <Route path={`page1/*`} element={asyncLazy(()=>import('./routes/Page1'))}/>
      <Route path={`page2/*`} element={asyncLazy(()=>import('./routes/Page2'))}/>
      {/*<Route path="*" component={Empty}/>*/}
    </Routes>
  )
});

