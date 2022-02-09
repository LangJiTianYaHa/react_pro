/* 
应用组件
*/
import React, { Component } from "react";
import PropTypes from 'prop-types'

export default class Counter extends Component {


  

  static propTypes = {
    // store:PropTypes.object.isRequired
    count:PropTypes.number.isRequired,
    increment:PropTypes.func.isRequired,
    decrement:PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.numberRef = React.createRef()
  }


  
  increment = ()=>{
    const number = this.numberRef.current.value * 1
    
    this.props.increment(number)
  }

  decrement = ()=>{
    const number = this.numberRef.current.value * 1
     
    this.props.decrement(number)


  }

  incrementIfOdd = ()=>{
    const number = this.numberRef.current.value * 1
    const count = this.props.count
    if(count % 2 ===1 ){
      this.props.increment(number)
    }
  }

  incrementAsync = ()=>{
    const number = this.numberRef.current.value * 1
    setTimeout(()=>{
      this.props.increment(number)
    },2000)
    
  }


  render(){
    const count = this.props.count
    return (
      <div>
        <p>click {count} times</p>
        <div>
          <select ref = {this.numberRef}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select><br />
          <button onClick={this.increment}>+</button>&nbsp;&nbsp;
          <button onClick={this.decrement}>-</button>&nbsp;&nbsp;
          <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;&nbsp;
          <button onClick={this.incrementAsync}>increment async</button>

        </div>
      </div>
    )
  }
  

  


}

