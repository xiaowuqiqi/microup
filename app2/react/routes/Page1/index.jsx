import React from 'react';
import {ClickText} from '@microUp/utils';
import {inject, observer} from 'mobx-react';

export default inject('masterStore')(observer((props) => {
  const {match, masterStore} = props
  return (<div>
    app2 page1 | app2Test: {String(!!masterStore.get('app2Test'))}
    <br/>
    <div>路由跳转</div>
    <ClickText path='/app2/page2' history={props.history}>
      to app2 page2
    </ClickText>
    <br/>
    <ClickText path='/app1/page1' history={props.history}>
      to app1 page1
    </ClickText>
    <br/>
    <ClickText path='/app1/page2' history={props.history}>
      to app1 page2
    </ClickText>
  </div>)
}));
