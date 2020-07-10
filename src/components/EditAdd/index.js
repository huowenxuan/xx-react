import OverlayViewFade from "../overlays/OverlayViewFade";
import React from "react";
import './index.css'
import images from "../../assets/images";
export default (props) => {
  const width = 267
  const {rect, onDismiss, onImage, onText, onLink, onVideo} = props
  const actions = [
    {text: '照片', action: () => _action(onImage), icon: images.add_photo_icon},
    {text: '文字', action: () => _action(onText),  icon: images.add_text_icon},
    {text: '链接', action: () => _action(onLink),  icon: images.add_line_icon},
    {text: '视频', action: () => _action(onVideo),  icon: images.add_video_icon},
  ]

  const _action = (action) => {
    onDismiss && onDismiss()
    action && action()
  }

  const _renderActions = () => {
    return actions.map(({text, action, icon}) => (
      <div
        onClick={action}
        key={text}
        className='add-action'
      >
        <img  className='add-action-icon' src={icon}/>
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
        onTouchStart={onDismiss}
        style={{width: '100%', height: '100%'}}
      >
        <div
          id='add-overlay-box'
          style={{
            width,
            top: rect.top + rect.height,
            left: rect.left + rect.width / 2 - width / 2
          }}
        >
          <div className='add-triangle-box'>
            <div className='add-triangle'/>
          </div>
          <div
            onTouchStart={e => e.stopPropagation()}
            className='add-actions'
          >
            {_renderActions()}
          </div>
        </div>

      </div>
    </OverlayViewFade>
  )

}