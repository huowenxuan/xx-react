'use strict'

import React, {PureComponent} from 'react';
import OverlayView from './OverlayView'

/**
 * 从下弹出，再掉落
 */
const windowHeight = window.screen.height
const Duration = 300
export default class OverlayViewPopup extends OverlayView {
  constructor(props) {
    super(props)
    this.state = {
      fadeOpacity: 0,
      upTop: windowHeight
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
        upTop: 0
      })
    }, 20)
  }

  disappear() {
    this.setState({
      fadeOpacity: 0,
      upTop: windowHeight
    })
    setTimeout(() => {
      super.onDisappearCompleted()
    }, Duration)

  }

  render() {
    const {fadeOpacity, upTop} = this.state
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${Duration}ms`,
        opacity: fadeOpacity,
      }}>
        <div style={{
          ...styles.main,
          transition: `transform ${Duration}ms ease-in-out`,
          transform: `translate(0, ${upTop}px)`
        }}>
          {this.props.children}
        </div>
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
  },
  main: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
}