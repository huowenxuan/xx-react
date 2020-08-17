import OverlayViewFade from "../../overlays/OverlayViewFade";
import React from "react";
import './index.less'
import images from "../../../assets/images";
export default (props) => {
  const width = 267
  const {rect, onDismiss, onImage, onText, onLink, onVideo} = props
  const actions = [
    {text: '照片', action: () => _action(onImage), icon: images.add_photo_icon},
    {text: '文字', action: () => _action(onText),  icon: images.add_text_icon},
    {text: '链接', action: () => _action(onLink),  icon: images.add_link_icon},
    {text: '视频', action: () => _action(onVideo),  icon: images.add_video_icon},
  ]

  const _action = (action) => {
    action && action()
    onDismiss && onDismiss()
  }

  const _renderActions = () => {
    return actions.map(({text, action, icon}) => (
      <div
        onClick={action}
        key={text}
        className='action'
      >
        <img  className='icon' src={icon}/>
        {text}
      </div>
    ))
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
        <div
          className='box'
          style={{
            width,
            top: rect.top + rect.height,
            left: rect.left + rect.width / 2 - width / 2
          }}
        >
          <div className='triangle-box'>
            <div className='triangle'/>
          </div>
          <div
            onTouchStart={e => e.stopPropagation()}
            className='actions'
          >
            {_renderActions()}
          </div>
        </div>

      </div>
    </OverlayViewFade>
  )

}