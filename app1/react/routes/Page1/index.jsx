import React from 'react';
import {ClickText, ExternalComponent} from '@microUp/utils';
import test from '@/assets/img/测试.jpeg';
import {inject, observer} from 'mobx-react';

export default inject('masterStore')(observer((props) => {
  const {history, masterStore} = props
  return (<div>
    app1 page1
    <h4>1，测试引入静态文件</h4>
    <img src={test} alt="" style={{width: '100px'}}/>
    <h4>2，全局状态管理测试，与 remote 模块数据通信</h4>
    <button onClick={() => {
      masterStore.set('app2Test', !masterStore.get('app2Test'))
    }}>点击改变 app2Test 变量
    </button>
    <h5>引入 app2 externalize 组件</h5>
    <ExternalComponent
      system={{
        scope: 'app2', module: 'App2EC',
      }}
    />
    <h5>全量引入 app2 模块</h5>
    <div style={{borderLeft: "2px black solid",paddingLeft:'8px'}}>
      <ExternalComponent
        {...props}
        match={{...props.master, url: '/app1'}}
        system={{
          scope: 'app2', module: './app2',
        }}
      />
    </div>
    <h4>3，本模块路由跳转</h4>
    <h5>跳转当前模块的 page2 路由</h5>
    <ClickText path='/app1/page2' history={history}>
      to app1 page2
    </ClickText>
    <h4>4，remote 模块路由跳转</h4>
    <h5>跳转 app2 模块的 page1 路由</h5>
    <ClickText path='/app2/page1' history={history}>
      to app2 page1
    </ClickText>
    <h5>跳转 app2 模块的 page2 路由</h5>
    <ClickText path='/app2/page2' history={history}>
      to app2 page2
    </ClickText>
  </div>)
}))
