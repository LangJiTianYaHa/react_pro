import React, { Component } from "react";
import { Card, Select, Input, Button, Icon, Table, message } from "antd";
import LinkButton from "../../components/link-button";
import {
  reqProducts,
  reqSearchProducts,
  reqUpdateStatus,
} from "../../api/index";
import { PAGE_SIZE } from "../../utils/constants";
import memoryUtils from "../../utils/memoryUtils";

const Option = Select.Option;

export default class ProductHome extends Component {
  state = {
    products: [], //商品数组
    total: 0, //商品总数量
    loading: false, //正在加载中
    searchName: "", //搜索关键字
    searchType: "productName", // 根据哪个字段搜索
  };
  /* 
   初始化table列的数组
  */
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        //当前指定了对应的属性，传入的是对应的属性值
        render: (price) => "¥" + price,
      },
      {
        width: 100,
        title: "状态",
        // dataIndex: 'status',
        render: (product) => {
          const { status, _id } = product;
          const newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => (
          <span>
            {/* 将product 对象使用state传递给目标路由组件 */}
            {/* <LinkButton onClick ={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton> */}
            <LinkButton
              onClick={() =>
                /* this.props.history.push("/product/detail", { product }) */
                this.showDetail(product)
              }
            >
              详情
            </LinkButton>
            <LinkButton
              onClick={() => this.showUpdate(product)
            }
            >
              修改
            </LinkButton>
          </span>
        ),
      },
    ];
  };

  /* 
  显示商品详情页面
  */
  showDetail = (product)=>{
    //缓存product对象 ===》  给detail组件使用
    memoryUtils.product = product
    this.props.history.push("/product/detail")

  }
  /* 
  显示修改商品页面
  */
  showUpdate = (product)=>{
    //缓存product对象 ===》  给detail组件使用
    memoryUtils.product = product
    this.props.history.push("/product/addupdate")

  }

  /* 
   获取指定页码的列表数据显示
   */
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; //保存pageNum 让其他方法可以看见
    this.setState({ loading: true });

    const { searchName, searchType } = this.state;
    //如果关键字有值 是搜索分页
    let result;
    if (searchName) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      // 一般分页请求
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    this.setState({ loading: false });
    if (result.status === 0) {
      //取出分页数据 更新动态 显示分页列表
      const { total, list } = result.data;
      this.setState({
        total,
        products: list,
      });
    }
  };

  /* 
  更新指定商品的状态
  */
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      message.success("商品状态更新成功");
      this.getProducts(this.pageNum);
    }
  };

  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getProducts(1);
  }
  render() {
    //取出状态数据
    const { products, total, loading, searchName, searchType } = this.state;

    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={(e) => this.setState({ searchName: e.target.value })}
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        <Icon type="plus" />
        添加商品
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          bordered
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts,
          }}
        />
        ;
      </Card>
    );
  }
}