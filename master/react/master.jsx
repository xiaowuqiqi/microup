import React from 'react';
import {Route, Outlet} from 'react-router-dom';
import {MasterStoreProvider} from './store';
import {Empty, ErrorPage} from '@microup/utils';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log('onUpdate')
    registration.waiting.postMessage({type: 'SKIP_WAITING'})
  }
});
const Index = () => {
  // const {match, AutoRouter} = props
  return (
    <MasterStoreProvider>
      <Outlet/>
    </MasterStoreProvider>
  )
};
Index.getStaticRoutes = (AutoRouter) => {
  return [
    <Route key='error_page' path='error_page' element={<ErrorPage/>}/>,
    <Route key='undefined' path='undefined' element={<Empty/>}/>,
    ...AutoRouter.getStaticRoutes({
      ErrorComponent: <ErrorPage/>, // <Navigate to="/error_page"/>
      notFound: <Empty/>
    }),
  ]
}

export default Index;
