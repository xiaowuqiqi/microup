import React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';

export default inject('masterStore')(observer((props) => {
  const {match, masterStore} = props
  return (<div>
    app2 page1 | app2Test: {String(!!masterStore.get('app2Test'))}
    <br/>
    <div>路由跳转1aaaaaw</div>
    <Link to='/app2/page2' >
      to app2 page2
    </Link>
    <br/>
    <Link to='/app1/page1' >
      to app1 page1
    </Link>
    <br/>
    <Link to='/app1/page2' >
      to app1 page2
    </Link>
  </div>)
}));
