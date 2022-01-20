import React, { Component } from "react";
import { Card, Table, Icon, Button, message, Modal } from "antd";
import LinkButton from "../../components/link-button/index";
import { reqCategorys, reqUpdateCategory, reqAddCategory } from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

/* 
商品分类路由
*/

export default class Category extends Component {
  state = {
    categorys: [], //一级分类列表
    loading: false, //加载状态（图标）
    parentId: "0", // 父分类ID
    parentName: "", //父分类名称
    subCategorys: [], //子分类列表
    showStatus: 0, //标识添加/更新的确认框是否显示 0： 不显示  1 ：显示添加  2：显示更新
  };

  /* 
    初始化Table列的数组
  */
  initColumns = () => {
    this.columns = [
      {
        title: "分类的名称",
        dataIndex: "name", //显示数据对应的属性名
      },
      {
        title: "操作",
        width: 300,
        render: (
          category //会把分类的对象传递过来
        ) => (
          //返回需要显示的界面标签
          <span>
            <LinkButton
              onClick={() => {
                this.showUpdate(category);
              }}
            >
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton onClick={() => this.showSubCategorys(category)}>
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
      },
    ];
  };

  /* 
 异步获取一级/二级分类列表显示
 parentId: 如果没有指定，根据状态中的parentId请求
          如果指定根据指定的请求
 */
  getCategorys = async (parentId) => {
    //在发请求前显示loading
    this.setState({ loading: true });
    parentId = parentId || this.state.parentId;
    const result = await reqCategorys(parentId);
    //请求完成后 隐藏loading
    this.setState({ loading: false });
    if (result.status === 0) {
      //取出分类数组数据
      const categorys = result.data;
      if (parentId === "0") {
        //更新一级分类数组
        this.setState({ categorys });
      } else {
        this.setState({ subCategorys: categorys });
      }
      //更新二级分类数组
    } else {
      message.error("获取分类列表失败");
    }
  };
  /* 
  显示指定一级分类对象的二级列表
  */
  showSubCategorys = (category) => {
    //更新状态
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        //在状态更新且render后执行
        //显示二级分类列表
        this.getCategorys();
      }
    );
    console.log("parentId:", this.state.parentId);
  };

  /* 
    点击显示一级分类列表
  */
  showCategorys = () => {
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };

  /* 
  响应点击取消 隐藏确认框
  */
  handleCancel = () => {
    this.setState({
      showStatus: 0,
    });
    //清除输入数据
    this.form.resetFields();
  };
  /* 
  添加分类
  */
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //隐藏确认框
        this.setState({
          showStatus: 0,
        });

        //收集数据 并提交添加分类的请求
        // const { parentId, categoryName } = this.form.getFieldsValue();
        const { parentId, categoryName } = values;
        this.form.resetFields();
        const result = await reqAddCategory(categoryName, parentId);
        //重新获取添加分类的请求
        if (result.status === 0) {
          if (parentId === this.state.parentId) {
            this.getCategorys();
          } else if (parentId === "0") {
            // 在二级分类列表下添加一级分类项  重新获取一级分类列表  但不需要显示一级分类列表
            this.getCategorys("0");
          }
        }
      }
    });
  };

  /* 
 更新分类
 */
  updateCategory = () => {
    console.log("updateCategory");
    //进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //1.隐藏确认框
        this.setState({
          showStatus: 0,
        });
        // 准备数据
        const categoryId = this.category._id;
        // const categoryName = this.form.getFieldValue('categoryName')
        const { categoryName } = values;
        //清除输入数据
        this.form.resetFields();
        //2.发请求更新分类
        const result = await reqUpdateCategory({ categoryId, categoryName });
        if (result.status === 0) {
          //3.重新显示列表
          this.getCategorys();
        }
      }
    });
  };
  /* 
 显示添加确认框
*/
  showAdd = () => {
    this.setState({
      showStatus: 1,
    });
  };
  /* 
显示修改确认框
*/
  showUpdate = (category) => {
    //保存分类对象
    this.category = category;
    this.setState({
      showStatus: 2,
    });
  };

  /* 
 为第一次render准备数据
 */
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  /* 
  执行异步任务：发异步ajax请求
  */
  componentDidMount() {
    this.getCategorys();
  }

  render() {
    //读取状态数据
    const {
      categorys,
      loading,
      subCategorys,
      parentId,
      parentName,
      showStatus,
    } = this.state;

    //读取指定的分类
    const category = this.category || {};
    //card 的右侧
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: 10 }} />
          <span>{parentName}</span>
        </span>
      );
    //card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus" />
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          bordered
          rowKey="_id"
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          loading={loading}
        />
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
      </Card>
    );
  }
}
