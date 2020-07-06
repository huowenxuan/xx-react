import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TopView from './TopView'
import App from "../../App";

export default class Overlay extends Component {
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
      ReactDOM.render(
        <TopView emitter={this.emitter}/>,
        this.state.node
      )
    )
    // return (
    //   ReactDOM.createPortal(
    //     <TopView emitter={this.emitter}/>,
    //     this.state.node
    //   )
    // )
  }
}
