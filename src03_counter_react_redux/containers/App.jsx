/*
包装UI   组件的容器组件通过connect()生成
*/

// import React from 'react'
import {connect} from 'react-redux'


import Counter from '../components/Counter'
import {increment, decrement} from '../redux/actions'


/* function mapStateToProps(state){
  return {
    count:state
  }
} */


/* function mapDispatchToProps(dispatch) {
  return {
    increment:(number) => dispatch(increment(number)),
    decrement:(number) => dispatch(decrement(number)),
  }

} */

// 指定向Counter传入哪些一般属性(属性值的来源就是store中的state)
// const mapStateToProps = (state) => ({count: state})
// 指定向Counter传入哪些函数属性
/*如果是函数, 会自动调用得到对象, 将对象中的方法作为函数属性传入UI组件*/
/*const mapDispatchToProps = (dispatch) => ({
  increment: (number) => dispatch(increment(number)),
  decrement: (number) => dispatch(decrement(number)),
})*/


export default connect(
  state => ({count:state}),
  {increment,decrement},
)(Counter)