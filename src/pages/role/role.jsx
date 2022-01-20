import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  message
}from 'antd'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils.js'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'


export default class Role extends Component {

  constructor(props){
    super(props)
    this.auth = React.createRef()



  }

  state = {
    roles : [], // 所有角色列表
    role : {}, //选中的角色
    isShowAdd:false, //是否显示添加界面
    isShowAuth:false, //是否显示设置角色权限
  }

  OnRow = (role)=>{
    return {
      onClick: event => {
        console.log('role onClick',role)
        this.setState({
          role
        })
      }, // 点击行
    }
  }
   /* 
   初始化列表
   */
  initColumn = ()=>{
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render : (create_time) =>formateDate(create_time)

        }
      ,
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render : formateDate

      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ]
  }

  //获取所有角色列表
  getRoles = async ()=>{
    const result  = await reqRoles()
    if(result.status === 0){
      const roles = result.data
      this.setState({
        roles
      })

    }
  }

  

  /* 
  添加角色
  */
  addRole = ()=>{
    //进行表单验证
    this.form.validateFields( async (err, values) => {
      if (!err) {
        //隐藏确认框
        this.setState({
          isShowAdd:false
        })
       //收集数据
       const {roleName}  = values
       //清除输入框
       this.form.resetFields()
       //调用接口请求添加
       const result = await reqAddRole(roleName)
       if(result.status === 0){
         message.success('角色添加成功')
        //更新roles状态
        //1.重新获取所有的角色
         //this.getRoles()
        //2. 把新角色塞到角色数组里：
        // const role = result.data
        // const roles =  this.state.roles
        // roles.push(role)
        // this.setState({
        //   roles
        // }) 
        // 3.更新 roles 状态: 基于原本状态数据更新
        const role = result.data
        this.setState(state =>({
          roles:[...state.roles,role]
        }))
       }else{
         message.error('角色添加失败')
       }
      }
    })

  }
  /* 
  更新角色
   */
  updateRole  = async ()=>{

    //隐藏确认框
    this.setState({
      isShowAuth:false
    })

    const role = this.state.role
    //得到最新的menus
    const menus =  this.auth.current.getMenus()
    role.menus = menus
    role.auth_name = memoryUtils.user.username
    role.auth_time = Date.now()
    //请求更新
    const  result = await reqUpdateRole(role)
    if(result.status === 0){
      // this.getRoles()
      //如果当前更新的是自己角色的权限 强制退出
      if(role._id === memoryUtils.user.role_id){
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.warning('当前角色权限已经修改，请重新登录')
      }else{
        message.success('设置角色权限成功')
        this.setState({
          roles:[...this.state.roles]
        })
      }
      
    }
  }

  UNSAFE_componentWillMount(){
    this.initColumn()
  }

  componentDidMount(){
    this.getRoles()
  }
  render() {

    const {roles,role,isShowAdd,isShowAuth} = this.state 

    const title =(
      <span>
        <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>
        &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置创建角色</Button>
      </span>
    )
    return (
      <Card title = {title}>
        <Table
          dataSource={roles}
          columns={this.columns}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 2, showQuickJumper: true }}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect : (role)=>{
              this.setState({
                role
              })
            }
          }}
          onRow = {this.OnRow}
        />

      <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() =>{
            this.setState({
              isShowAdd : false
            })
          } }
        >
          <AddForm
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() =>{
            this.setState({
              isShowAuth : false
            })
          } }
        >
          <AuthForm role={role} ref={this.auth } />
        </Modal>

      </Card>
    )
  }
}
