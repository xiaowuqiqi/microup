import React from 'react';
import {ClickText} from '@microup/utils';
import {inject,observer} from 'mobx-react';

export default inject('masterStore')(observer(({match,history, masterStore}) => {
  return (
    <div>
      app2 page2
      <div>{masterStore.get('app2Test')}</div>
      <ClickText path='/app2/page1' history={history}>
        to page1
      </ClickText>
    </div>
  )
}));
