/* 
redux  最核心的管理对象：store
*/

import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducer from "./reducer";


export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))
// 向外暴露 store 对象
// 创 建 store 对象内部会第一次调用 reducer()得到初始状态值
