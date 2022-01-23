/* 
入口js

*/
import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'

import memoryUtils from './utils/memoryUtils'
import storageUtils  from './utils/storageUtils'
import App from './App'
import {Provider} from 'react-redux'


// 如果 local 中保存了 user, 将 user 保存到内存中
const user = storageUtils.getUser()
if(user && user._id){
  memoryUtils.user = user
}



// 将App组件标签渲染到index页面的div上
ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))