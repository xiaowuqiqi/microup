import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';
// import {Loading, rootStore} from '@microup/utils';
// import App from '{{ appPath }}';
import Master from '{{ master }}';
import AutoRouter from '{{ routesPath }}';
import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";

if (typeof process === 'undefined' && typeof window !== 'undefined' && !window.import) {
  window.import = require('dimport/legacy');
}
if (typeof process === 'undefined') {
  window.process = {env: {}};
}

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route
      path='/*'
      element={<Master/>}
    >
      {Master.getStaticRoutes(AutoRouter)}
    </Route>
  ])
)
const Render = () => {
  return <RouterProvider router={router}/>
}
render(<Render/>, document.getElementById('microup-app'));
