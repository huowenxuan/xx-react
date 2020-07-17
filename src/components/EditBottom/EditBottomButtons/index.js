import React, {PureComponent, useEffect} from "react"
import {withStateHandlers, compose, pure} from "recompose"
import {Statuses} from '../EditStatus'
import './index.css'
import images from "../../../assets/images"

export const EditBottomHeight = 63
const EditBottom = (props) => {
  const {audio, status} = props
  const show = () => {
    // overlays.show(<EditBottomOverlay/>)
  }

  const onLeftClick = (e) => {
    const {onLeftClick, onRightClick} = props
    e.stopPropagation()
    onLeftClick && onLeftClick()
  }

  const onRightClick = (e) => {
    const {onLeftClick, onRightClick} = props
    e.stopPropagation()
    onRightClick && onRightClick()
  }

  const _renderBtn = (text, isActive, activeImg, unActiveImg, action, desc, style) => {
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

  return (
    <div id='edit-bottom' style={{height: EditBottomHeight}}>
      {_renderBtn(
        '背景音频',
        props.active === 'audio',
        images.icon_music_red,
        images.icon_music,
        onLeftClick,
        audio ? audio.filename : '',
        {marginLeft: 50}
      )}
      {_renderBtn(
        '谁可以看',
        props.active === 'status',
        images.icon_limit_red,
        images.icon_limit,
        onRightClick,
        status ? Statuses.find(i=>i.type===status).title : ''
      )}
    </div>
  )
}
export default compose(pure)(EditBottom)