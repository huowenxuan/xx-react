import React, {PureComponent} from 'react'
import OverlayView from './OverlayView'
import PropTypes from "prop-types"

/**
 * 轻提示，一段时间后隐藏
 */
const AnimDuration = 100
const MinScale = 0.9
export default class OverlayViewToast extends OverlayView {
  constructor(props) {
    super(props)
    this.state = {
      fadeOpacity: 0,
      scale: MinScale
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
      scale: MinScale
    })
    setTimeout(() => {
      super.onDisappearCompleted()
    }, AnimDuration)
  }

  render() {
    const {fadeOpacity, scale} = this.state
    const {text} = this.props
    return (
      <div style={styles.container}>
        <div style={{
          ...styles.main,
          transition: `transform ${AnimDuration}ms ease-out, opacity ${AnimDuration}ms`,
          transform: `scale(${scale},${scale})`,
          opacity: fadeOpacity
        }}>
          <p style={styles.textBox}>
            {text}
          </p>
        </div>
      </div>

    )
  }
}

let styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    pointerEvents: 'none',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  textBox: {
    margin: '0 10%',
    color: 'white',
    fontSize: '14px',
    padding: '10px 38px',
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0, .6)',
    border: '#00000010 1px solid',
    boxShadow: '0px 6px 20px #00000020'
  }
}