/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */
import axios from "axios";
import { message } from "antd";

export default function ajax(url, data = {}, type = "GET") {
  return new Promise((resolve, reject) => {
    let promise;
    if (type === "GET") {
      //get请求
      promise = axios.get(url, { params: data });
    } else {
      //post请求
      promise = axios.post(url, data);
    }
    //成功回调
    promise
      .then((response) => {
        resolve(response.data);
      })
      //失败回调
      .catch((error) => {
        message.error("请求出错了！" + error.message);
      });
  });
}
//请求登录接口
// ajax('/login',{username:'Tom',password:'123456'},'POST').then()
// //添加用户
// ajax('/manage/user/add',{username:'Tom',password:'123456',phone:'16605189406',email:'166@qq.com',role_id:'1144714'},'POST')

// .then()
// .then()
// .then()
// .then()
// .then()