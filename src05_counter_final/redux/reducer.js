/*
reducer 函数: 根据旧的state 和指定的action 处理返回新的state
*/
import {combineReducers} from 'redux'
import {INCREMENT,DECREMENT} from './action-types'


/* 
 管理count状态的reducer
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
 管理user状态的reducer
*/

/*
combineReducers函数: 接收包含所有reducer函数的对象, 返回一个新的reducer函数(总reducer)
总的reducer函数管理的state的结构
  {
    count: 2,
    user: {}
  }
 */
const initUser = {}
function user(state = initUser ,action){
  switch(action.type){
    default:
      return state
  }
}

export default combineReducers({
  count,
  user
})