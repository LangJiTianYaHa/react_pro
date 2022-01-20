import React, { Component } from "react";
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd';

import LinkButton from '../link-button/index'
import { reqWeather } from "../../api/index";
import menuList from "../../config/menuConfig";

import { formateDate } from "../../utils/dateUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import "./index.less";

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    dayPictureUrl: "", // 天气图片url
    weather: "", // 天气的文本
  };

  //实时获取时间
  getTime = () => {
    this.intervalId =  setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };
  //实时获取天气
  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather("北京");
    this.setState({ dayPictureUrl, weather });
  };

  // 获取标题
  getTitle = ()=>{
    // 得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach((item)=>{
    //请输入代码体
      if(item.key === path){
        title = item.title

      }else if(item.children){
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title

  }

  //退出登录
  logout = ()=>{
    const { confirm } = Modal;
    confirm({
      content: '确定退出吗？',
      onOk:()=>{
        // console.log('OK');
        //移出保存的user
        storageUtils.removeUser()
        memoryUtils.user = {}
        //跳转到login
        this.props.history.replace('/login')
      },
      
    });


  }

  /*
  第一次render()之后执行一次
  一般在此执行异步操作: 发ajax请求/启动定时器
   */
  componentDidMount() {
    // 获取当前的时间
    this.getTime();
    // 获取当前天气
    this.getWeather();
  }

  componentWillUnmount(){
    //清除定时器
    clearInterval(this.intervalId)
  }

  render() {
    const { currentTime, dayPictureUrl, weather } = this.state;
    const username = memoryUtils.user.username

    const title = this.getTitle()

    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton  onClick = {this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img
              src={dayPictureUrl}
              alt="weather"
            />

            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header)
