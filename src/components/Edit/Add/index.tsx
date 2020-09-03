import OverlayViewFade from "../../overlays/OverlayViewFade"
import React from "react"
import './index.less'
import images from "../../../assets/images"

export default (props) => {
  const width = 267
  const {rect, onDismiss, onImage, onText, onLink, onVideo} = props
  const actions = [
    {text: '照片', action: () => _action(onImage), icon: images.add_photo_icon},
    {text: '文字', action: () => _action(onText), icon: images.add_text_icon},
    {text: '链接', action: () => _action(onLink), icon: images.add_link_icon},
    {text: '视频', action: () => _action(onVideo), icon: images.add_video_icon},
  ]

  const _action = (action) => {
    action && action()
    onDismiss && onDismiss()
  }

  const _renderActions = () => {
    return <div
      onTouchStart={e => e.stopPropagation()}
      className='actions'
    >
      {actions.map(({text, action, icon}) => (
        <div
          onClick={action}
          key={text}
          className='action'
        >
          <img className='icon' src={icon}/>
          {text}
        </div>
      ))}
    </div>
  }


  const renderBottomPop = () => {
    return (
      <div
        className='box'
        style={{
          width,
          top: rect.top + rect.height,
          left: rect.left + rect.width / 2 - width / 2
        }}
      >
        <div className='triangle-box bottom'>
          <div className='triangle bottom'/>
        </div>
        {_renderActions()}
      </div>
    )
  }

  const renderTopPop = () => {
    return (
      <div
        className='box'
        style={{
          width,
          top: rect.top - rect.height - 26,
          left: rect.left + rect.width / 2 - width / 2
        }}
      >
        {_renderActions()}
        <div className='triangle-box top'>
          <div className='triangle top'/>
        </div>
      </div>
    )
  }

  return (
    <OverlayViewFade
      duration={200}
      {...props}
      style={{backgroundColor: 'transparent'}}
    >
      <div
        onMouseDown={onDismiss}
        onTouchStart={onDismiss}
        className='edit-add-overlay'
      >
        {(rect.y + rect.height) >= (window.innerHeight - rect.height)
          ? renderTopPop()
          : renderBottomPop()
        }

      </div>
    </OverlayViewFade>
  )

}