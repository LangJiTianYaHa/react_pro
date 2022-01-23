/*
redux 最核心的管理对象store
*/
import {createStore} from 'redux'
import reducer from './reducer'

export default createStore(reducer)