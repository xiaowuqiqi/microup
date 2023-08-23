import React from 'react';
import {Route, Switch, withRouter, NavLink} from 'react-router-dom'
import classnames from 'classnames'
import styles from '@microUp-boot/src/exampleMaster/index.module.less'
import styles2 from '@/exampleMaster/index.module.less'
// withRouter 添加 history 等参数

export default withRouter((props) => {
  const {AutoRouter, match} = props
  console.log(props, styles, styles2)
  return (
    <div>
      <div className={classnames(styles.red)}>master</div>
      <NavLink to="/app1" exact>app1</NavLink>
      <NavLink to="/app2" exact>app2</NavLink>
      <Switch>
        <Route path={match.url} component={AutoRouter}/>
      </Switch>
    </div>
  );
})
