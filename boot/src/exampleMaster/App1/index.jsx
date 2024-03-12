import React from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {asyncLazy} from '@microup/utils';


export default (props) => {
  return (
    <Routes>
      <Route index element={asyncLazy(()=>import('./Page1'))}/>
      <Route path={`page1/*`} element={asyncLazy(()=>import('./Page1'))}/>
      {/*<Route path="*" component={Empty}/>*/}
    </Routes>
  )
};
