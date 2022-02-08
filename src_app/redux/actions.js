/*
包含 n 个用来创建 action 的工厂函数(action creator)
同步action ：  对象{type:'xxx',data:数据值}
异步action：   函数 dispatch => {}
 */

import { message } from 'antd'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-types'


/* 
设置头部标题的同步action
*/
export const setHeadTitle = (headTitle) =>({type: SET_HEAD_TITLE, data:headTitle})

/* 
接收用户信息的同步action
*/
export const receiveUser = (user)=>({type:RECEIVE_USER,user})
/* 
显示错误信息的同步action
*/
export const showErrorMsg = (errorMsg)=>({type:SHOW_ERROR_MSG,errorMsg})

/* 
登录的异步action
*/
export const login = (username,password) =>{
  return async dispatch =>{
    //1.执行异步Ajax请求
    //{status:0,data:user}   {"status": 1,"msg": ""}
    const result = await reqLogin(username,password)
    //2.1如果成功 分发成功的同步action
    if(result.status === 0){
      const user = result.data
      //保存在local中
      storageUtils.saveUser(user)
      //分发接收用户的同步action
      dispatch(receiveUser(user))
      message.success('登陆成功')
    }else{
      //2.2如果失败 分发失败的同步action
      const msg = result.msg
      // message.error(msg)
      dispatch(showErrorMsg(msg))

    }
  }
}

/* 
退出登录的同步action
*/
export const logout = () =>{ 
  //删除local中的user
  storageUtils.removeUser()
  //返回action对象
  message.success('退出登录成功')
  return {type:RESET_USER}
}