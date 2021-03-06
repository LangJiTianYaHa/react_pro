/* 
应用的根组件
*/
import React, { Component } from "react";
// import {Button,message} from 'antd'
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./pages/login/login.jsx";
import Admin from "./pages/admin/admin.jsx";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Admin} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
