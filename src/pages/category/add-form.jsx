import React, { Component } from "react";
import { Form, Input, Select } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
const Option = Select.Option;

class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired, // 一级分类数组
    parentId: PropTypes.string.isRequired, //父分类id
    setForm : PropTypes.func.isRequired //  用来传递form对象的函数
  }

  UNSAFE_componentWillMount(){
    this.props.setForm(this.props.form)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { categorys, parentId } = this.props;
    return (
      <Form>
        <Item>
          {getFieldDecorator("parentId", {
            initialValue: parentId,
          })(
            <Select>
              <Option value="0">一级分类</Option>
              {
                categorys.map(c => <Option value={c._id}>{c.name}</Option>)
              }
            </Select>
          )}
        </Item>

        <Item>
          {getFieldDecorator("categoryName", {
            initialValue: '',
            rules: [
              {
                required:true,message:'分类名称必须输入'
              }
            ]
          })(<Input placeholder="请输入分类名称" />)}
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm);
