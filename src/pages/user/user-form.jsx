import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option




class UserForm extends Component {


  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    roles: PropTypes.array.isRequired, //  角色数组
    user: PropTypes.object
  }

  UNSAFE_componentWillMount(){
    this.props.setForm(this.props.form)
  }

  //自定义校验密码
  validatePwd = (rule, value, callback)=>{
     if(value.length<4){
     callback('密码必须不能小于4位')
    }else if(value.length>12){
     callback('密码必须不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
     callback('密码必须为英文、数字或下划线组成')
    }else{
      callback()
    }
   }
   //自定义校验手机号
   validatePhone = (rule, value, callback)=>{
     if(!/^1[3-9][0-9]{9}$/.test(value)){
      callback('手机号不符合规范')
     }else{
       callback()
     }
   }
   //自定义校验邮箱
   validateEmail = (rule, value, callback)=>{
     if(!/^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/.test(value)){
      callback('邮箱不符合规范')
     }else{
       callback()
     }
   }

  render() {

    const {roles,user} = this.props
    const { getFieldDecorator } = this.props.form
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('username', {
              //声明式验证
              rules: [
                { required: true,whitespace:true, message: '用户名必须输入' },
                {min:4,message:'用户名必须大于4位'},
                {max:12,message:'用户名必须小于12位'},
                {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须为英文、数字或下划线组成'}
              
              ],
              initialValue: user.username,
            })(
              <Input 
                placeholder='请输入用户名'
                autoComplete="off"  //取消默认的input历史记录
                />
            )
          }
        </Item>


        {
          user._id ? null : (
            <Item label='密码'>
              {
                getFieldDecorator('password', {
                  rules:[
                    { required: true,whitespace:true,message: '密码必须输入' },
                    {validator:this.validatePwd}
                  ],
                  initialValue: user.password,
                })(
                  <Input type='password' placeholder='请输入密码'/>
                )
              }
              </Item>
          )
        }

        
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              rules:[
                { required: true,whitespace:true,message: '手机号必须输入'  },
                {validator:this.validatePhone}
              ],
              initialValue: user.phone,
            })(
              <Input placeholder='请输入手机号' autoComplete="off" />
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              rules:[
                { required: true,whitespace:true,message: '邮箱必须输入'  },
                {validator:this.validateEmail}
              ],
              initialValue: user.email,
            })(
              <Input placeholder='请输入邮箱' autoComplete="off"/>
            )
          }
        </Item>
        <Item label='角色'>
          {
            getFieldDecorator('role_id', {
              rules: [
                { required: true, message: '角色类型必须选择' },
              ],
              initialValue: user.role_id,
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>
                  )
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)
