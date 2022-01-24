/* 
入口js

*/
import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'

import App from './App'
import {Provider} from 'react-redux'

// 将App组件标签渲染到index页面的div上
ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))