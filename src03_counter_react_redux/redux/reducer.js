/*
reducer 函数: 根据旧的state 和指定的action 处理返回新的state
*/

import {INCREMENT,DECREMENT} from './action-types'

export default function conut(state = 1,action){
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