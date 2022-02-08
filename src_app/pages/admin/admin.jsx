import React, { Component } from "react";
import { Redirect , Route , Switch} from "react-router-dom";
import { Layout } from "antd";

import Header from '../../components/header'
import LeftNav from '../../components/left-nav'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Order from '../order/order'
import {connect} from 'react-redux'


const {  Footer, Sider, Content } = Layout;

 class Admin extends Component {
  render() {
    const user = this.props.user;
    if (!user || !user._id) {
      return <Redirect to="/login" />;
    }

    return (
      <Layout style={{minHeight:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: 20,backgroundColor: '#fff'}}>
            <Switch>
              <Route path='/home' component= {Home}></Route>
              <Route path='/category' component= {Category}></Route>
              <Route path='/product' component= {Product}></Route>
              <Route path='/role' component= {Role}></Route>
              <Route path='/user' component= {User}></Route>
              <Route path='/charts/bar' component= {Bar}></Route>
              <Route path='/charts/line' component= {Line}></Route>
              <Route path='/charts/pie' component= {Pie}></Route>
              <Route path='/order' component= {Order}></Route>
              <Redirect to = '/home'/>

            </Switch>

          </Content>
          <Footer style={{textAlign: 'center', color: '#aaaaaa'}}>推荐使用谷歌浏览器， 可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  state => ({user:state.user}),
  {}
)(Admin)
