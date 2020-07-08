import React, {PureComponent} from "react";
import './index.css'
import overlays from '../overlays/'
import EditBottomOverlay from './EditBottomOverlay/'

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

  _show = ()=> {
    // overlays.show(<EditBottomOverlay/>)
  }

  render() {
    const {extend} = this.state
    const {onLeftClick, onRightClick} = this.props
    return (
      <div id='edit-bottom'>
        <button
          onClick={onLeftClick}
          className='edit-btn'>
          左边
        </button>
        <button
          onClick={onRightClick}
          className='edit-btn'>
          右边
        </button>
      </div>
    )
  }
}