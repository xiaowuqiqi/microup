import React from 'react';
import {Link} from 'react-router-dom';
import {inject,observer} from 'mobx-react';

export default inject('masterStore')(observer(({match,history, masterStore}) => {
  return (
    <div>
      app2 page2
      <div>{masterStore.get('app2Test')}</div>
      <Link to='/app2/page1'>
        to page1
      </Link>
    </div>
  )
}));
