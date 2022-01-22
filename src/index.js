/* 
入口js

*/
import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/App'
import store from './redux/store'
import {Provider} from 'react-redux'

// 将store 传递给 provider 组件

ReactDOM.render((
  <Provider store={store}>
  <App/>
  </Provider>
  ), document.getElementById('root'))