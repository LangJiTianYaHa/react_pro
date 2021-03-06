import React, { Component } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;

class AddForm extends Component {
  static propTypes = {
    setForm : PropTypes.func.isRequired //  用来传递form对象的函数
  }

  UNSAFE_componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5}, //左侧label的宽度
      wrapperCol: { span: 15 },//右侧label的宽度
    }
    return (
      <Form {...formItemLayout}>
        <Item label='角色名称'>
          {getFieldDecorator("roleName", {
            initialValue: '',
            rules: [
              {
                required:true,message:'角色名称必须输入'
              }
            ]
          })(<Input placeholder="请输入角色名称" />)}
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm);
