/*
reducer 函数: 根据旧的state 和指定的action 处理返回新的state
*/

import {INCREMENT,DECREMENT} from './action-types'
import {combineReducers} from '../lib/redux'

/* 
 管理count状态数据的reducer函数
*/
 function count(state = 1,action){
  console.log('count()','state:',state,'action',action)

  switch(action.type){
    case INCREMENT:
      return state + action.number
    
      case DECREMENT:
        return state - action.number
      
      default:
        return state
  }

}

/* 
管理用户信息的reducer函数
*/
function user(state = {},action) {
  console.log('user()','state:',state,'action',action)
  switch (action.type) {
    default:
      return state
  }
}

 export default  combineReducers({
  count,
  user
})