import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';

const App = lazy(() => import('{{ main }}'));

render((
  <Suspense fallback={<span />}>
    <App />
  </Suspense>
), document.getElementById('microup-app'));
