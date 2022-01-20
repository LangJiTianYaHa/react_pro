import React, { Component } from 'react'
import {
  Card,
  Modal,
  Button,
  Table,
  message
} from 'antd'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/index'
import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtils'
import UserForm from './user-form'

const { confirm } = Modal;

/* 
用户路由
*/
export default class User extends Component {

  state = {
    isShow:false, // 是否显示确认框
    users:[],//所有用户列表
    roles:[] //所有角色列表
  }


  //初始化列
  initColumns = ()=>{
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title:'邮箱',
        dataIndex:'email'
      },
      {
        title:'电话',
        dataIndex:'phone'
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:'所属角色',
        dataIndex:'role_id',
        // render: (role_id) => this.state.roles.find(role => role._id === role_id).name 
        render : (role_id)=> this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick = {() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={()=> this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
      
    ]
  }
  /* 
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
  */
  initRoleNames = (roles)=>{
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames
  }

  //获取用户
  getUsers = async ()=>{
    const result = await reqUsers()
    if(result.status === 0){
      const {users,roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }
  //删除用户
  deleteUser = (user)=>{
    console.log('user',user)
    confirm({
      title: `你想要删除${user.username}吗？`,
      onOk: async () =>{
         const result = await reqDeleteUser(user._id)
         if(result.status === 0){
          message.success(`删除用户${user.username}成功！`)
          this.getUsers()
         }else{
           message.error(`删除用户失败！`)
         }
      },
       
    });
  }
  /* 
    添加/更新用户
  */
 addOrUpdateUser =   ()=>{

  this.form.validateFields(async (err, values) => {
      if(!err){
        console.log('Received values of form: ', values)

        this.setState({isShow:false})
        //收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()

        //如果是更新 需要给user指定_id属性
        if(this.user){
          user._id = this.user._id
        }

        //提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        //更新列表显示
        if(result.status === 0){
          message.success(`${this.user ? '修改' : '添加'}用户成功！`)
          this.getUsers()
        } 
      }
  })
 }
/* 
 显示修改界面
*/
showUpdate = (user)=>{
  this.user = user //保存user
  this.setState({
    isShow:true
  })
}
  /* 
  显示添加界面
*/
showAdd = ()=>{
  this.user = null
  this.setState({isShow:true})
}



  UNSAFE_componentWillMount (){
    this.initColumns()
  }

  componentDidMount(){
    this.getUsers()
  }

  render() {
    const {isShow,users,roles} = this.state
    const user = this.user  || {}

    const  title =  (
      <Button type = 'primary' onClick= {this.showAdd} >创建用户</Button>
    )
    
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 2}}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={()=>{
            this.form.resetFields()
            this.setState({isShow : false})
          }}
        >
          <UserForm 
            setForm={form => this.form = form}
            roles = {roles}
            user = {user}
          /> 
        </Modal>
      </Card>
    )
  }
}
