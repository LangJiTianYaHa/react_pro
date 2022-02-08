/*
reducer 函数模块: 
根据当前 state 和指定 action 返回一个新的 state 
*/

import { combineReducers } from "redux"
import storageUtils from "../utils/storageUtils"
import {RECEIVE_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG,RESET_USER} from './action-types'

/*管理 headTitle 状态数据的 reducer */

const initHeadTitle = '首页'
function headTitle(state=initHeadTitle,action){
  switch(action.type){
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}

/*管理 user 状态数据的 reducer */
const initUser = storageUtils.getUser()
function user(state=initUser,action){
  switch(action.type){
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      return {...state, errorMsg}
    case RESET_USER:
      return {}
    default:
      return state
  }
}

/*向外暴露合并后产生的总 reducer 函数 总的 state 的结构:

 { headerTitle: '', user: {} }
 
 */
export default combineReducers({
  headTitle,
  user
})