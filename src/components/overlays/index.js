import React from "react";
import TopView from "./TopView";
import OverlayViewPopup from "./OverlayViewPopup";
import OverlayViewDialog from "./OverlayViewDialog";
import ActionSheet from "./LightBox/ActionSheet";

export default {
  showActionSheet: (buttons)=>{
    TopView.show(
      <OverlayViewPopup >
        <ActionSheet buttons={buttons} onDismiss={TopView.hideTop}/>
      </OverlayViewPopup>
    )
  },
  showDialog: (text, duration)=>{
    TopView.show(
      <OverlayViewDialog text={text} duration={duration}/>
    )
  }
}