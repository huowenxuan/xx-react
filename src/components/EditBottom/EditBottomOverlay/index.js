import React, {PureComponent} from 'react';
import OverlayView from '../../overlays/OverlayView'
import EditBottom from '../../EditBottom'
import './index.css'

const windowHeight = window.screen.height
const Duration = 1000
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    // permission music
    let status= 'permission'
    this.state = {
      fadeOpacity: 1,
      permissionBottom: -windowHeight,
      status,
      height: this.getHeight(status),
    }
  }

  getHeight(status) {
    if (status === 'music') {
      return '100%'
    } else if (status === 'permission') {
      return '300px'
    }
  }

  componentDidMount() {
    super.componentDidMount()

    setInterval(()=>{
      this.setState((prevState)=>{
        const {status: prevStatus} = prevState
        let status = ''
        if (prevStatus === 'permission') {
          status = 'music'
        } else {
          status = 'permission'
        }
        return {
          status,
          height: this.getHeight(status)
        }
      })
    }, 1000)
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
      <div style={{backgroundColor: 'blue', height: '100%'}}>
        <p>哈哈</p>
        <p>haha</p>
      </div>
    )
  }

  _renderPermission() {
    return (
      <div style={{backgroundColor: 'red', height: '100%'}}>
        <p>扇上生花是</p>
        <p>xoodjjjfj</p>
        <p>非佛二级坡</p>
      </div>
    )
  }

  render() {
    const {permissionBottom, height ,status} = this.state
    let view = null
    if (status === 'permission') {
      view = this._renderPermission()
    } else {
      view = this._renderMusic()
    }
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${Duration}ms`,
        opacity: this.state.fadeOpacity
      }}>
        <div
          style={{bottom: permissionBottom, height}}
          className="permission-container"
        >
          {view}
        </div>

        {/*<EditBottom/>*/}
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
    pointerEvents: 'auto',
    padding: 200
  }
}