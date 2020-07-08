import React, {PureComponent} from 'react';
import OverlayView from './OverlayView'

/**
 * 渐现缩小，类似iOS
 */
const Duration = 300
export default class OverlayViewFadeReduce extends OverlayView {
  constructor(props) {
    super(props)

    this.state = {
      fadeOpacity: 0,
      scale: 1.2
    }
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  appear() {
    setTimeout(() => {
      this.setState({
        fadeOpacity: 1,
        scale: 1
      })
    }, 20)
  }

  disappear() {
    this.setState({
      fadeOpacity: 0,
      scale: 1.2
    })
    setTimeout(() => {
      super.onDisappearCompleted()
    }, Duration)

  }

  render() {
    const {fadeOpacity, scale} = this.state
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${Duration}ms, transform ${Duration}ms`,
        opacity: fadeOpacity,
        transform: `scale(${scale}, ${scale})`
      }}>
        {this.props.children}
      </div>
    )
  }
}

let styles = {
  container: {
    backgroundColor: '#00000030',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'auto'
  }
}