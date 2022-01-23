/*
action creator 模块
包含n 个action creator 函数
*/

import {INCREMENT,DECREMENT} from './action-types'
/* 
增加的action
*/
export const increment = (number)=> ({type:INCREMENT,number})

/* 
减少的action
*/
export const decrement = (number)=> ({type:DECREMENT,number})

/* 
异步增加的action
*/

export const incrementAsync =  (number)  =>  {
  //返回一个带dispatch参数的函数
  return dispatch => {
  //执行异步操作
    setTimeout(()=>{
  //有了结果后 分发同步action
      dispatch(increment(number))
    },2000)
  }


}