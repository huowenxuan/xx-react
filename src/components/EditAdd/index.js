import overlays from "../overlays";
import OverlayViewFade from "../overlays/OverlayViewFade";
import React from "react";
import './index.css'

export default (props) => {
  const {rect, onDismiss} = props
  return (
    <OverlayViewFade {...props} style={{backgroundColor: 'transparent'}}>
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
            onClick={(e) => {
              e.stopPropagation()
            }}
            onTouchStart={e => e.stopPropagation()}
          />
        </div>

      </div>
    </OverlayViewFade>
  )

}