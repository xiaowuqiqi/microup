import React from 'react';
import {observer, inject} from 'mobx-react';

export const Empty = inject('masterStore')(observer((props) => {
  return (
    <div>empty</div>
  )
}));
