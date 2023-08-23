import React from 'react';
import {observer,inject} from 'mobx-react';

export default inject('masterStore')(observer(({match, masterStore}) => {
  return (<div>app2-externalize-components | app2Test: {String(!!masterStore.get('app2Test'))}</div>);
}))
/* externalize: App2EC */
