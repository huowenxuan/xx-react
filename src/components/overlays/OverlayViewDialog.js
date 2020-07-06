'use strict'

import React, {PureComponent} from 'react';
import OverlayView from './OverlayView'
import PropTypes from "prop-types";

/**
 * 轻提示，一段时间后隐藏
 */
const AnimDuration = 200
export default class OverlayViewPopup extends OverlayView {
  constructor(props) {
    super(props)
    this.state = {
      fadeOpacity: 0,
      bottom: 0,
      scale: 0
    }
  }

  static propTypes = {
    duration: PropTypes.number,
    text: PropTypes.string,
  }

  static defaultProps = {
    duration: 3 * 1000,
  }

  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  appear() {
    const {duration} = this.props
    setTimeout(() => {
      this.setState({
        fadeOpacity: 1,
        bottom: 100,
        scale: 1
      })
    }, 20)

    setTimeout(() => {
      this.disappear()
    }, duration)
  }

  disappear() {
    this.setState({
      fadeOpacity: 0,
      bottom: 0,
      scale: 0
    })
    setTimeout(() => {
      super.onDisappearCompleted()
    }, AnimDuration)
  }

  render() {
    const {fadeOpacity, bottom, scale} = this.state
    const {text} = this.props
    return (
      <div style={{
        ...styles.main,
        transition: `transform ${AnimDuration}ms ease-out, opacity ${AnimDuration}ms`,
        transform: `translate(0, ${-bottom}px) scale(${scale},${scale})`,
        opacity: fadeOpacity
      }}>
        <p style={styles.textBox}>
          {text}
        </p>
      </div>
    )
  }
}

let styles = {
  main: {
    backgroundColor: 'transparent',
    position: 'absolute',
    pointerEvents: 'none',
    left: 0,
    right: 0,
    bottom: 50,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  textBox: {
    margin: '0 10%',
    color: 'black',
    fontSize: '17px',
    padding: '10px 30px',
    borderRadius: 20,
    backgroundColor: 'white',
    border: '#00000010 1px solid',
    boxShadow: '0px 6px 20px #00000020'
  }
}