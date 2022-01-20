import React, { PureComponent } from "react";
import { Form,Input,Tree } from "antd";
import PropTypes from "prop-types";

import menuConfig from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree


export default class AuthForm extends PureComponent {
  static propTypes = {
    role:PropTypes.object
  }

  constructor(props){
    super(props)
    //根据传入的menu生成初始状态
    const {menus}  = this.props.role
    this.state = {
      checkedKeys:menus
    }

  }

  getTreeNodes = (menuConfig) => {
    return menuConfig.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  //为父组件提供获取最新menus的方法
  getMenus = ()=>{
    return this.state.checkedKeys
  }

  //选中某个node时
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  UNSAFE_componentWillMount(){
    this.treeNodes = this.getTreeNodes(menuConfig)
  }

  //根据新传入的role来更新checkedKey状态
  //当组件接收到新的属性时自动调用
  UNSAFE_componentWillReceiveProps(nextProps){
    console.log('UNSAFE_componentWillReceiveProps',nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys:menus
    })
  }

  render() {
    console.log('render() authform')


    const {role} = this.props
    const {checkedKeys} = this.state
    const formItemLayout = {
      labelCol: { span: 5}, //左侧label的宽度
      wrapperCol: { span: 15 },//右侧label的宽度
    }
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
        <Input  value={role.name} disabled   />
        </Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
        <TreeNode title="平台权限" key="all">
          {
            this.treeNodes
          }
        </TreeNode>
      </Tree>
      </div>
        
    )
  }
}
