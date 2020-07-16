import React from "react";

/**
 * 渐隐渐现高阶组件
 */
export default function opacityWrapper(Container) {
  class WrappedComponent extends Container {
    constructor(props) {
      super(props);
      this.state.__opacity = 0
    }

    componentDidMount() {
      super.componentDidMount()
      setTimeout(() => {
        this.setState({
          __opacity: 1
        })
      })
    }

    hidden = (cb) => {
      this.setState({__opacity: 0}, () => {
        setTimeout(() => {
          cb && cb()
        }, 300)
      })
    }

    render() {
      const {__opacity} = this.state
      return (
        <div
          style={{

            opacity: __opacity,
            transition: `opacity 300ms ease-out`
          }}
        >
          {super.render()}
        </div>
      )
    }
  }

  return WrappedComponent
}