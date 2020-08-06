import React from "react"
import TopView from "./TopView"
import OverlayViewPopup from "./OverlayViewPopup"
import OverlayViewToast from "./OverlayViewToast"
import ActionSheet from "./LightBox/ActionSheet"
import Alert from "./LightBox/Alert"
import OverlayViewFade from "./OverlayViewFade"
import OverlayViewFadeReduce from "./OverlayViewFadeReduce"

export default {
  showActionSheet: (buttons) => {
    TopView.show(
      <OverlayViewPopup>
        <ActionSheet buttons={buttons} onDismiss={TopView.hideTop}/>
      </OverlayViewPopup>
    )
  },
  showToast: (text, duration?) => {
    TopView.show(
      <OverlayViewToast text={text} duration={duration}/>
    )
  },
  showAlert: (title, description, buttons, opts?) => {
    opts = opts || {}
    TopView.show(
      <OverlayViewFadeReduce duration={200}>
        <Alert
          title={title}
          description={description}
          buttons={buttons}
          showClose={opts.showClose}
        />
      </OverlayViewFadeReduce>
    )
  },
  show: (element) => {
    return TopView.show(element)
  },
  dismiss: (key) => {
    TopView.hideWithKey(key)
  },
  dismissAll: () => {
    TopView.hideAll()
  }
}