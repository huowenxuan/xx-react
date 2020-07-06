import React from "react";
import TopView from "./TopView";
import OverlayViewPopup from "./OverlayViewPopup";
import ActionSheet from "./LightBox/ActionSheet";

export default {
  showActionSheet: (buttons)=>{
    TopView.show(
      <OverlayViewPopup >
        <ActionSheet buttons={buttons} onDismiss={TopView.hideTop}/>
      </OverlayViewPopup>
    )
  }
}