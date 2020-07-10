import React, {PureComponent} from 'react';
import OverlayView from '../../overlays/OverlayView'
import EditBottom, {EditBottomHeight} from '../../EditBottom'
import './index.css'
import EditMusic from '../EditMusic/'
import EditPermission from '../EditPermission/'

const windowHeight = window.screen.height
const Duration = 300
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    // permission music
    let status = props.status || 'permission'
    this.state = {
      fadeOpacity: 1,
      bottom: -windowHeight,
      status,
      height: this.getHeight(status),
      x: this.getX(status),
    }
  }

  getHeight(status) {
    if (status === 'music') {
      return `calc(100% - ${EditBottomHeight}px)`
    } else if (status === 'permission') {
      return '180px'
    }
  }

  getX(status) {
    if (status === 'music') {
      return '0'
    } else if (status === 'permission') {
      return '-50%'
    }
  }

  componentDidMount() {
    super.componentDidMount()
  }

  _update(status) {
    this.setState((prevState) => {
      return {
        status,
        height: this.getHeight(status),
        x: this.getX(status),
      }
    })
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }

  appear() {
    setTimeout(() => {
      this.setState({
        bottom: 0,
        fadeOpacity: 1
      })
    }, 20)
  }

  disappear() {
    this.setState({
      fadeOpacity: 0,
      bottom: -windowHeight,
    })
    setTimeout(() => {
      super.onDisappearCompleted()
      console.log('done')
    }, Duration)
  }

  _renderMusic() {
    return (
      <EditMusic
        onBack={this.disappear}
      />
    )
  }

  _renderPermission() {
    return (
      <EditPermission/>
    )
  }

  render() {
    const {bottom, height, status, x} = this.state
    let view
    if (status === 'music')
      view = this._renderMusic()
    else
      view = this._renderPermission()

    return (
      <div
        onClick={this.disappear}
        style={{
          ...styles.container,
          transition: `opacity ${Duration}ms`,
          opacity: this.state.fadeOpacity
        }}>

        <div
          style={{
            bottom: bottom + EditBottomHeight,
            height,
          }}
          className="bottom-overlay-container"
        >
          {view}
        </div>

        <EditBottom
          onLeftClick={(e) => {
            this._update('music')
          }}
          onRightClick={(e) => {
            this._update('permission')
          }}
        />

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
    overflow: 'auto',
    pointerEvents: 'auto'
  }
}