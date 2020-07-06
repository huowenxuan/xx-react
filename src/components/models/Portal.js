import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Portal.css';

export default function Portal(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      //直接插入dom节点到body下
      if (!this.node) {
        this.node = document.createElement("div");
        document.body.appendChild(this.node);
      }
    }

    componentWillUnmount() {
      this.node && this.node.remove();
    }

    //渲染内容
    renderContent() {
      return (
        <div className="portal" onClick={this.props.hide}>
          <WrappedComponent {...this.props}/>
        </div>
      )
    }

    render() {
      const {visible} = this.props;
      if (visible)
        return (
          this.node && ReactDOM.createPortal(
            this.renderContent(),
            this.node
          )
        )
      return null
    }
  }
}
