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
          onClick={(e) => {
            e.stopPropagation()
          }}
          onTouchStart={e => e.stopPropagation()}
          id='overlay-test'
          style={{
            top: rect.top + rect.height,
            left: rect.left + rect.width / 2 - 276 / 2
          }}
        />
      </div>
    </OverlayViewFade>
  )

}