import overlays from "../overlays";
import OverlayViewFade from "../overlays/OverlayViewFade";
import React from "react";
import './index.css'

export default (props) => {
  const {rect, onDismiss, onImage, onText, onLink, onVideo} = props
  const actions = [
    {text: '照片', action: () => _action(onImage)},
    {text: '文字', action: () => _action(onText)},
    {text: '链接', action: () => _action(onLink)},
    {text: '视频', action: () => _action(onVideo)},
  ]

  const _action = (action) => {
    onDismiss && onDismiss()
    action && action()
  }

  const _renderActions = () => {
    return actions.map(({text, action}) => (
      <div
        onClick={action}
        key={text}
        className='add-action'
      >
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
            top: rect.top + rect.height,
            left: rect.left + rect.width / 2 - 276 / 2
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