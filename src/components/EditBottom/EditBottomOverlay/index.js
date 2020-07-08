import React, {PureComponent} from 'react';
import OverlayView from '../../overlays/OverlayView'
import EditBottom from '../../EditBottom'
import './index.css'

const windowHeight = window.screen.height
const Duration = 1000
const file1 = require('./1.png')
const file2 = require('./2.png')
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    // permission music
    let status = 'permission'
    this.state = {
      fadeOpacity: 1,
      permissionBottom: -windowHeight,
      status,
      height: this.getHeight(status),
      x: this.getX(status),
    }
  }

  getHeight(status) {
    if (status === 'music') {
      return '100%'
    } else if (status === 'permission') {
      return '300px'
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
        permissionBottom: 0,
        fadeOpacity: 1
      })
    }, 20)
  }

  disappear() {
    this.setState({
      fadeOpacity: 0
    })
    setTimeout(() => {
      super.onDisappearCompleted()
    }, Duration)

  }

  _renderMusic() {
    return (
      <div style={{backgroundColor: 'white', height: '100%', width: '50%'}}>
        <img
          style={{width: '100%'}}
          src={file1}
        />
      </div>
    )
  }

  _renderPermission() {
    return (
      <div style={{backgroundColor: 'white', height: '100%', width: '50%'}}>
        <img
          style={{width: '100%'}}
          src={file2}
        />
      </div>
    )
  }

  render() {
    const {permissionBottom, height, status, x} = this.state
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${Duration}ms`,
        opacity: this.state.fadeOpacity
      }}>

        <div
          className='test'
          style={{
            height
          }}
        >
          <div
            style={{
              bottom: permissionBottom,
              transform: `translate(${x}, 0)`
            }}
            className="bottom-overlay-container"
          >
            {this._renderMusic()}
            {this._renderPermission()}
          </div>
        </div>

        <EditBottom
          onLeftClick={() => {
            this._update('music')
          }}
          onRightClick={() => {
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
    padding: 200
  }
}