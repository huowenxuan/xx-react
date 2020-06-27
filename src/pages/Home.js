import React, {Component} from 'react'

export default class Home extends Component {
  render() {
    return (
      <div>
        <a href='#/detail/1'>去detail</a>
        <button onClick={()=>this.props.history.push('detail/1')}>go</button>
      </div>
    )
  }
}