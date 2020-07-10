import React from "react";
import TopView from "./TopView";
import OverlayViewPopup from "./OverlayViewPopup";
import OverlayViewToast from "./OverlayViewToast";
import ActionSheet from "./LightBox/ActionSheet";

export default {
  showActionSheet: (buttons) => {
    TopView.show(
      <OverlayViewPopup>
        <ActionSheet buttons={buttons} onDismiss={TopView.hideTop}/>
      </OverlayViewPopup>
    )
  },
  showToast: (text, duration) => {
    TopView.show(
      <OverlayViewToast text={text} duration={duration}/>
    )
  },
  show: (element) => {
    return TopView.show(element)
  },
  dismiss: (key) => {
    TopView.hideWithKey(key)
  }
}