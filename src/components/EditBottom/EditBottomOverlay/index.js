import React, {PureComponent} from 'react';
import OverlayView from '../../overlays/OverlayView'
import EditBottomButtons, {EditBottomHeight} from '../../EditBottom/EditBottomButtons/'
import './index.css'
import EditAudio from '../EditAudio/'
import EditStatus from '../EditStatus/'

const windowHeight = window.screen.height
const Duration = 300
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    let type = props.type || 'status'
    this.state = {
      fadeOpacity: 0,
      bottom: -windowHeight,
      type,
      height: this.getHeight(type),
      x: this.getX(type),
      status: props.status,
      audio: props.audio
    }
  }

  getHeight(type) {
    if (type === 'audio') {
      return `calc(100% - ${EditBottomHeight}px)`
    } else if (type === 'status') {
      return '180px'
    }
  }

  getX(type) {
    if (type === 'audio') {
      return '0'
    } else if (type === 'status') {
      return '-50%'
    }
  }

  componentDidMount() {
    super.componentDidMount()
  }

  _update(type) {
    const {type: prevType} = this.state
    if (prevType === type) {
      this.disappear()
    } else {
      this.setState({
        type,
        height: this.getHeight(type),
        x: this.getX(type),
      })
    }
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
    }, Duration)
  }

  _onUpdate = (field, data) => {
    const {audio, onUpdate} = this.props
    onUpdate(field, data)
    if (field === 'audio_id') field = 'audio'
    this.setState({[field]: data})
  }

  _renderAudio() {
    const {audio, onUpdate} = this.props
    return (
      <EditAudio
        onBack={this.disappear}
        audio={audio}
        onUpdate={this._onUpdate}
      />
    )
  }

  _renderStatus() {
    const {status, onUpdate, protect} = this.props
    return (
      <EditStatus
        protect={protect}
        status={status}
        onUpdate={this._onUpdate}
        onDismiss={this.disappear}
      />
    )
  }

  render() {
    const {bottom, height, type, x, status, audio} = this.state
    let view
    if (type === 'audio')
      view = this._renderAudio()
    else
      view = this._renderStatus()

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

        <EditBottomButtons
          active={type}
          status={status}
          audio={audio}
          onLeftClick={() => this._update('audio')}
          onRightClick={() => this._update('status')}
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