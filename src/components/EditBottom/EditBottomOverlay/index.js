import React, {PureComponent} from 'react';
import OverlayView from '../../overlays/OverlayView'
import EditBottom from '../../EditBottom'
import './index.css'

const Duration = 300
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    this.state = {
      fadeOpacity: 0
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
      this.setState({fadeOpacity: 1})
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

  render() {
    return (
      <div style={{
        ...styles.container,
        transition: `opacity ${Duration}ms`,
        opacity: this.state.fadeOpacity
      }}>
        <div className="test">
        </div>
        <EditBottom/>
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