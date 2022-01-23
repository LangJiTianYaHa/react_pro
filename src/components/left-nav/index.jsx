import React, { Component } from 'react'
import {Link , withRouter} from 'react-router-dom'
import { Menu, Icon  } from 'antd';
import menuConfig from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils';

import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu } = Menu;


class LeftNav extends Component {

  /* 
  判断当前登录用户对item 是否有权限
  */
  hasAuth = (item)=>{
    const  {key,isPublic} = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /* 
      1.如果当前用户是admin
      2.当前用户有此item权限：key有没有在menus中
      3.如果当前用户是公开的
    */
   if(username === 'admin' || isPublic || menus.indexOf(key) !== -1){
    return true
   }else if(item.children){  //4.当前用户有此item的某个子item的权限
    return !!item.children.find(child => menus.indexOf(child.key) !== -1)
   }
   return false
  }

  /* 
  方法1： 根据menu的数据生成对应的标签数组
  使用map+递归
  */

  getMenuNodes_map = (menuConfig)=>{
    return menuConfig.map((item)=>{
      //如果没有childern
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title} </span>
              </Link>
              
            </Menu.Item>
        )
      }else{
        //如果有childern
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title} </span>
              </span>
            }
          >
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  /* 
  方法2： 根据menu的数据生成对应的标签数组
  reduce+递归
  */
  getMenuNodes = (menuConfig)=>{
    // 得到当前请求路径, 作为选中菜单项的 key
    const path = this.props.location.pathname

    /* 
    arr.reduce(function(prev,cur,index,arr){
    ...
    }, init);
    arr 表示原数组；
    prev 表示上一次调用回调时的返回值，或者初始值 init;
    cur 表示当前正在处理的数组元素；
    index 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1；
    init 表示初始值。
    */
    return menuConfig.reduce((pre,item)=>{
      /* 
      如果当前用户有item对应的权限  才需要显示对应的菜单项
      */
     if(this.hasAuth(item)){

      if(!item.children){
        pre.push((
          <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title} </span>
              </Link>
              
            </Menu.Item>
        ))
      }else{

        //查找一个与当前请求路径匹配的子item
        // const cItem =  item.children.find(cItem => cItem.key === path)
        const cItem =  item.children.find(cItem => path.indexOf(cItem.key) === 0)
        // 如果存在 说明当前item的子列表需要打开
        if(cItem){
          this.openKey = item.key
        }
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title} </span>
              </span>
            }
          >
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        ))
      }
     }
      
      return pre
    },[])
  }

  // 在第一次render之前执行一次
  UNSAFE_componentWillMount(){
    this.memuNodes = this.getMenuNodes(menuConfig)
  }

  render() {
    // debugger
    // const memuNodes = this.getMenuNodes(menuConfig)

    // 得到当前请求路径, 作为选中菜单项的 key
    let  path = this.props.location.pathname
    console.log(path)
    //当前请求的是商品或其子路由界面
    if(path.indexOf('/product') === 0){
      path = '/product'
    }

    //得到需要打开的openKey
    const  openKey = this.openKey

    return (
      <div className='left-nav'>
        <Link to = '/' className = 'left-nav-header'>
          <img src={logo} alt="logo" />
          <h1>硅谷后台</h1>
        </Link>

        

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys = {[path]}
          defaultOpenKeys={[openKey]}

        >
          {/* <Menu.Item key="/home">
            <Link to = '/home'>
              <Icon type="pie-chart" />
              <span>首页</span>
            </Link>
          </Menu.Item>
          
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>商品 </span>
              </span>
            }
          >
            <Menu.Item key="/category">
              <Link to='/category'>
                <Icon type="mail" />
                <span>品类管理 </span>
              </Link>
              
            </Menu.Item>
            <Menu.Item key="/product">
              <Link to = '/product'>
                <Icon type="mail" />
                <span>商品管理 </span>
              </Link>
              
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/user">
            <Link to = '/user'>
              <Icon type="pie-chart" />
              <span>用户管理</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/role">
            <Link to = '/role'>
              <Icon type="pie-chart" />
              <span>角色管理</span>
            </Link>
          </Menu.Item> */}

          {
            // this.getMenuNodes(menuConfig)
            this.memuNodes
          }

          
        </Menu>
      </div>
    )
  }
}
/*withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件, 
新组件会向被包装组件传递 history/location/match 属性 */
export default withRouter(LeftNav)