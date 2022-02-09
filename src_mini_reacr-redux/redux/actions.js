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
