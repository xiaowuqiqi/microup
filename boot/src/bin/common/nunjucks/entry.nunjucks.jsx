import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';
import {Loading, rootStore} from '@microUp/utils';
import App from '{{ appPath }}';
import Master from '{{ master }}';

if (typeof process === 'undefined' && typeof window !== 'undefined' && !window.import) {
  window.import = require('dimport/legacy');
}
if (typeof process === 'undefined') {
  window.process = {env: {}};
}

const Index = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    rootStore.set('Master', Master);
    setReady(true);
  }, []);
  if (ready) {
    return (
      <App/>
    );
  }

  return <Loading/>;
};

render(<Index/>, document.getElementById('microup-app'));
