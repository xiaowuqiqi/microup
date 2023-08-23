import React from 'react';
import {observer} from 'mobx-react-lite';
import classnames from 'classnames';

import './index.less';

/**
 * 渲染表格的可点击单元文字
 * @param props
 * @returns {*}
 * @constructor
 */
export const ClickText = observer((props) => {
  const {
    children, disabled = false, history, path, onClick,
  } = props;

  // ui 测试锚点
  function handleFn() {
    if (path && history) {
      history.push({
        pathname: path,
      });
    } else {
      if (onClick) onClick(history);
    }
  }

  return (<span className={classnames({
    "disabled": disabled, "link-text": true
  })} onClick={handleFn}>{children}</span>);
});
