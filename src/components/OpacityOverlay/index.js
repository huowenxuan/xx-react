import React, {PureComponent} from "react";
import './index.css'

const Duration = 250
export default class OpacityOverlay extends PureComponent {
  constructor(props) {
    super(props)
    const {show} = props
    this.state = {
      display: show ? 'inherit' : 'none',
      opacity: show ? 1 : 0
    }
  }

  componentWillReceiveProps(nextProps) {
    const {show} = nextProps
    if (show !== this.props.show) {
      show ? this.show() : this.hidden()
    }
  }

  show = () => {
    this.setState({display: 'inherit'}, () =>
      setTimeout(() =>
        this.setState({opacity: 1}))
    )
  }

  hidden = () => {
    const {onHidden} = this.props
    this.setState({opacity: 0})
    setTimeout(() => {
      this.setState({display: 'none'}, onHidden)
    }, Duration)
  }

  render() {
    const {opacity, display} = this.state
    return (
      <div
        className='item-overlay'
        style={{
          display,
          opacity,
          transition: `opacity ${Duration}ms ease-out`
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

