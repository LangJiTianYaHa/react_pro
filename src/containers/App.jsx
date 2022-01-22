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
export default connect(
  state => ({count:state}),
  {increment,decrement},
)(Counter)