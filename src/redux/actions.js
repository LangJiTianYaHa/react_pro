/*
包含 n 个用来创建 action 的工厂函数(action creator)
同步action ：  对象{type:'xxx',data:数据值}
异步action：   函数 dispatch => {}
 */

import {SET_HEAD_TITLE} from './action-types'

export const setHeadTitle = (headTitle) =>({type: SET_HEAD_TITLE, data:headTitle})
