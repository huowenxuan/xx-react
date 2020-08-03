import React, {PureComponent, useEffect} from "react"
import {withStateHandlers, compose, pure} from "recompose"
import {Statuses} from '../EditStatus'
import Fixed from '../../../Fixed'
import './index.less'
import images from "../../../../assets/images"

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
      <div className='button-box'>
        <button
          onClick={action}
          className='button'
          style={style}
        >
          <img className='img' src={isActive ? activeImg : unActiveImg}/>
          <p className={`title ${isActive ? 'active' : ''}`}>{text}</p>
          <p className='desc'>{desc}</p>
        </button>
      </div>
    )
  }

  return (
    <Fixed>
      <div
        className='edit-bottom'
        style={{height: EditBottomHeight}}
      >
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
          status ? Statuses.find(i => i.type === status).title : ''
        )}
      </div>
    </Fixed>
  )
}
export default compose(pure)(EditBottom)