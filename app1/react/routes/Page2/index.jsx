import React from 'react';
import {ClickText} from '@microUp/utils';

export default (props) => (
  <div>
    app1 page2
    <ClickText path='/app1/page1' history={props.history}>
      to page1
    </ClickText>
  </div>
);
