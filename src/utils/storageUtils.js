import store from 'store'

/* 
包含n个操作local storeage的工具函数模块
*/

const USER_KEY = 'user_key'
 // eslint-disable-next-line 
export default {

  saveUser(user){
    // 内部会自动转换成 json 再保存
    store.set(USER_KEY,user)
  },

  // 如果存在, 需要返回的是对象, 如果没有值, 返回{}
  getUser(){
    return  store.get(USER_KEY) || {}
  },

  removeUser(){
    store.remove(USER_KEY)
  }
}