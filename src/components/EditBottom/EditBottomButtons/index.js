import React, {PureComponent} from "react"
import './index.css'
import images from "../../../assets/images"

export const EditBottomHeight = 63
export default class EditBottom extends PureComponent {
  constructor(props) {
    super(props)
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

  _renderBtn = (text, isActive, activeImg, unActiveImg, action, desc, style) => {
    // 设置权限永远居中，音乐：没音乐则居中，有音乐就居左，设置marinleft
    return (
      <div className='edit-btn-box'>
        <button
          onClick={action}
          className='edit-btn'
          style={style}
        >
          <img className='edit-btn-img' src={isActive ? activeImg : unActiveImg}/>
          <p className={`edit-btn-title ${isActive ? 'edit-btn-active' : ''}`}>{text}</p>
          <p className='edit-btn-desc'>{desc}</p>
        </button>
      </div>

    )
  }

  render() {
    const {active} = this.props
    return (
      <div id='edit-bottom' style={{height: EditBottomHeight}}>
        {this._renderBtn(
          '背景音频',
          active === 'music',
          images.icon_music_red,
          images.icon_music,
          this.onLeftClick,
          '残影月 - faded钢琴独奏版',
          {marginLeft: 50}
        )}
        {this._renderBtn(
          '谁可以看',
          active === 'permission',
          images.icon_limit_red,
          images.icon_limit,
          this.onRightClick,
          '公开'
        )}
      </div>
    )
  }
}