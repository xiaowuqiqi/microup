import React from 'react';
import {Route, Outlet, Link, Navigate} from 'react-router-dom'
import classnames from 'classnames'
import styles from '@microup-boot/src/exampleMaster/index.module.less'
import styles2 from '@/exampleMaster/index.module.less'
// withRouter 添加 history 等参数
import {Empty, ErrorPage} from '@microup/utils';

const Index = (props) => {
  console.log(props, styles, styles2)
  return (
    <div>
      <div className={classnames(styles.red)}>master</div>
      <Link to="/a1/page1">app1</Link>
      <Link to="/a2">app2</Link>
      <Link to="/a3">app3</Link>
      <Outlet/>
    </div>
  );
}
Index.getStaticRoutes = (AutoRouter) => {
  return [
    <Route key='./error_page' path='error_page' element={<ErrorPage/>}/>,
    <Route key='./undefined' path='undefined' element={<Empty/>}/>,
    ...AutoRouter.getStaticRoutes({
      ErrorComponent: <ErrorPage/>, // <Navigate to="/error_page"/>
      notFound: <Empty/>
    }),
  ]
}
export default Index
