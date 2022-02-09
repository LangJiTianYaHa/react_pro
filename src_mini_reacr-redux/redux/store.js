/*
redux 最核心的管理对象store
*/
import {createStore} from '../lib/redux'
import reducer from './reducer'

export default createStore(reducer)