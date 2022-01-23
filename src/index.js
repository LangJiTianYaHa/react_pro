/* 
入口js

*/
import React from 'react'
import ReactDOM from 'react-dom'

import memoryUtils from './utils/memoryUtils'
import storageUtils  from './utils/storageUtils'
import App from './App'

// 如果 local 中保存了 user, 将 user 保存到内存中
const user = storageUtils.getUser()
if(user && user._id){
  memoryUtils.user = user
}



ReactDOM.render(<App/>,document.getElementById('root'))