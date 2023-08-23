/* eslint-disable no-underscore-dangle */
import React from 'react';
import loadComponent from './load-component';
import useManifest from './use-manifest';
import {Loading} from '../Loading';

const cache = new Map();

function getComponent({ scope, module }, ErrorComponent = null, setLoad) {
  const scopeItem = cache.get(scope) || new Map();
  cache.set(scope, scopeItem);
  const component = scopeItem.get(module);
  if (component) {
    return component;
  }
  const lazyComponent = React.lazy(
    loadComponent(scope, module, (error) => {
      console.error(error);
      return {
        default: () => ErrorComponent,
      };
    }, setLoad),
  );
  scopeItem.set(module, lazyComponent);
  return lazyComponent;
}

export function ExternalComponent(props) {
  const { system, notFound, ErrorComponent, fallback = <Loading />, setLoad} = props;
  const { ready, failed } = useManifest(system);

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (failed) {
    return notFound || <span />;
  }

  if (!ready) {
    return fallback || <Loading />;
  }

  const Component = getComponent(system, ErrorComponent, setLoad);

  return (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
}

