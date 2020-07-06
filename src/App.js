import React, {PureComponent} from 'react';
import logo from './logo.svg';
import './App.css';
import Router from './Router'
import Overlay from './components/overlays/Overlay'
import TopView from "./components/overlays/TopView";
import OverlayViewFade from "./components/overlays/OverlayViewFade";
import OverlayViewFadeReduce from "./components/overlays/OverlayViewFadeReduce";
import OverlayViewDrapDown from "./components/overlays/OverlayViewDrapDown";
import ActionSheet from "./components/overlays/LightBox/ActionSheet/"
import OverlayViewPopup from "./components/overlays/OverlayViewPopup";
import {EventEmitter} from 'events';
import ReactDOM from "react-dom";

let node = document.createElement("div")
document.body.appendChild(node);
ReactDOM.render(
  <TopView/>,
  node
)
// export default () => (
//   <div>
//     <Router/>
//     <Portal/>
//   </div>
// )

export default class extends PureComponent {
  componentDidMount() {
    setTimeout(() => {
      TopView.show(
        <OverlayViewPopup>
          <ActionSheet onDismiss={TopView.hideTop}/>
        </OverlayViewPopup>
      )
    }, 2000)
  }

  render() {
    return (
      <div>
        <Router/>
        {/*<Overlay emitter={emitter}/>*/}
      </div>
    )
  }
}
