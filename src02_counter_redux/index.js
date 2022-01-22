/* 
入口js

*/
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import store from './redux/store'

// 将store 传递给 APP 组件
ReactDOM.render(<App store = {store}/>,document.getElementById('root'))

// 通过store 订阅state 改变的监听 ==> 一旦store 中的state 改变了立即调用回调函数
store.subscribe(()=>{
  ReactDOM.render(<App store={store}/>, document.getElementById('root'))
})