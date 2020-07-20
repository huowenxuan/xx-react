import React, {PureComponent} from 'react';
import OverlayView from './OverlayView'

/**
 * 渐现缩小，类似iOS
 */
export default class OverlayViewFadeReduce extends OverlayView {
  state: any
  props: any
  duration
  constructor(props) {
    super(props)

    this.state = {
      fadeOpacity: 0,
      scale: 1.2,
    }
    this.duration = props.duration || 300
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
    }, this.duration)

  }

  render() {
    const {fadeOpacity, scale} = this.state
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${this.duration}ms ease-in-out, transform ${this.duration + 100}ms ease-in-out`,
        opacity: fadeOpacity,
        transform: `scale(${scale}, ${scale})`
      }}>
        {this.props.children}
      </div>
    )
  }
}

let styles: any = {
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