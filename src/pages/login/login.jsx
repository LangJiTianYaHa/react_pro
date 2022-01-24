import React, { Component } from "react";
import { Form, Input, Button ,Icon} from "antd";
import "./login.less";
import logo from "../../assets/images/logo.png";
import { Redirect } from "react-router-dom";
import{connect} from 'react-redux'
import {login} from '../../redux/actions'

 class Login extends Component {

  handleSubmit = (event)=>{

    //阻止表单默认行为
    event.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //console.log('提交登录的ajax请求', values);
        /* const {username,password} = values
        reqLogin(username,password).then(response=>{
          console.log('成功了',response.data)
        }).catch(error=>{
          console.log('失败了',error)
        }) */
        //使用asycy await简化写法
        const {username,password} = values
        
        /* const result = await reqLogin(username,password)
        console.log('请求成功了！',result)
        if(result.status === 0){
          //登陆成功  跳转到登录页面
          message.success('登陆成功')

          //保存user
          const user = result.data 
          storageUtils.saveUser(user)
          memoryUtils.user = user



          this.props.history.replace('/')
        }else{
          //登陆失败提示失败信息
          message.error(result.msg)
        } */
        // 调用分发异步action的函数 发登录的异步请求 有了结果后更新状态
        this.props.login(username,password)
      }else{
        console.log('校验失败！')
      }
    });

   //得到form对象
  //  const form  = this.props.form
  //  const values = form.getFieldsValue()
  //  console.log('handleSubmit',values)

  }

  //自定义校验
  validatePwd = (rule, value, callback)=>{
   console.log('validatePwd:',rule, value, callback)
   if(value===''){
    callback('密码必须输入')
   }else if(value.length<4){
    callback('密码必须不能小于4位')
   }else if(value.length>12){
    callback('密码必须不能大于12位')
   }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
    callback('密码必须为英文、数字或下划线组成')
   }else{
     callback()
   }
  }



  render() {

    //如果用户已经登陆 自动跳转到管理界面
    const user =  this.props.user
    if(user && user._id){
      return  <Redirect to  = '/home'/>
    }

    // const errorMsg= this.props.user.errorMsg


    const form  = this.props.form
    const { getFieldDecorator } = form;

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目：后台管理系统</h1>
        </header>

        <section className="login-content">
          <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            {/*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */}
            <Form.Item>
              {
                getFieldDecorator('username',{
                  //声明式验证
                  rules: [
                    { required: true,whitespace:true, message: '用户名必须输入' },
                    {min:4,message:'用户名必须大于4位'},
                    {max:12,message:'用户名必须小于12位'},
                    {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须为英文、数字或下划线组成'}
                  
                  ],
                  initialValue:'admin'  //指定初始值
                })(
                  <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                  autoComplete="off"  //取消默认的input历史记录
                />
                )
              }
            </Form.Item>
            <Form.Item>

            {
                getFieldDecorator('password',{
                  rules:[
                    {validator:this.validatePwd}
                  ]
                })(
                  <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
/* 
收集数据
表单验证
*/
const WrapLogin = Form.create()(Login);
export default  connect(
  state => ({user:state.user}),
  {login}
)(WrapLogin) ;

