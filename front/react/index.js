// import React from 'react';
// import {Route, Switch} from 'react-router-dom';
// import {inject} from 'mobx-react';
// import {ErrorPage} from '@microup/master';
//
// const Page1 = React.lazy(() => import('app1/app1'));
// const Page2 = React.lazy(() => import('app2/app2'));
//
// function Index({match, masterStore}) {
//   return (
//     <Switch>
//       <Route path={`${match.url}/app1`} component={Page1}/>
//       <Route path={`${match.url}/app2`} component={Page2}/>
//       <Route path="*" component={ErrorPage}/>
//     </Switch>
//   );
// }
//
// export default inject('masterStore')(Index);
