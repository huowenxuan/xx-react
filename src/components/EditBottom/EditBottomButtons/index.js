import React, {PureComponent} from "react";
import './index.css'

export const EditBottomHeight = 63
export default class EditBottom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      extend: false
    }
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this._show()
    // }, 1000)
  }

  show = () => {
    // overlays.show(<EditBottomOverlay/>)
  }

  onLeftClick = (e) => {
    const {onLeftClick, onRightClick} = this.props
    e.stopPropagation()
    onLeftClick && onLeftClick()
  }

  onRightClick = (e) => {
    const {onLeftClick, onRightClick} = this.props
    e.stopPropagation()
    onRightClick && onRightClick()
  }

  render() {
    const {extend} = this.state
    return (
      <div id='edit-bottom' style={{height: EditBottomHeight}}>
        <button
          onClick={this.onLeftClick}
          className='edit-btn'
        >
          音乐
        </button>
        <button
          onClick={this.onRightClick}
          className='edit-btn'
        >
          权限
        </button>
      </div>
    )
  }
}