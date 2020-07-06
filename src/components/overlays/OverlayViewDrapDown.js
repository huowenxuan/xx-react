'use strict'

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'
import OverlayView from './OverlayView'

/**
 * 从上掉下，再掉落
 */
const windowHeight = window.screen.height
const Duration = 300
export default class OverlayViewPopup extends OverlayView {
  constructor(props) {
    super(props)
    this.state = {
      fadeOpacity: 0,
      upTop: -windowHeight
    }
  }


  static propTypes = {
    duration: PropTypes.number
  }

  static defaultProps = {
    duration: Duration,
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
    const {duration} = this.props
    this.setState({
      fadeOpacity: 0,
      upTop: windowHeight
    })
    setTimeout(() => {
      super.onDisappearCompleted()
    }, duration)

  }

  render() {
    const {fadeOpacity, upTop} = this.state
    const {duration} = this.props
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${duration}ms`,
        opacity: fadeOpacity,
      }}>
        <div style={{
          ...styles.main,
          transition: `transform ${duration}ms ease-in-out`,
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
    height: windowHeight
  }
}