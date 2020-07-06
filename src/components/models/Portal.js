import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TopView from './TopView'

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: document.createElement("div")
    }
    document.body.appendChild(this.state.node);
    this.emitter = props.emitter
  }

  componentWillUnmount() {
    this.state.node && this.state.node.remove();
  }

  render() {
    if (!this.state.node) return null
    return (
      ReactDOM.createPortal(
        <TopView emitter={this.emitter}/>,
        this.state.node
      )
    )
  }
}
