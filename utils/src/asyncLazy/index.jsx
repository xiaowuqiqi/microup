import React from 'react';
import {Loading} from "../Loading";
import {ErrorBoundary} from "react-error-boundary";
import {Navigate} from "react-router-dom";
import {Empty} from "../Empty";

export const asyncLazy = (
  importFn,
  props,
  fallback = <Loading/>,
  ErrorComponent = <Empty/>
) => {
  const routeUndefined = (error) => {
    console.error(`route undefined:${error}`)
    return <Navigate to="/undefined"/>
  }
  if (!importFn) return routeUndefined('route path 为空，无对应页面')
  const LazyEle = React.lazy(importFn);
  if (!LazyEle) return routeUndefined(`route path 错误，无对应页面`)
  return (
    <ErrorBoundary fallback={ErrorComponent}>
      <React.Suspense fallback={fallback}>
        <LazyEle {...props}/>
      </React.Suspense>
    </ErrorBoundary>
  )
}
