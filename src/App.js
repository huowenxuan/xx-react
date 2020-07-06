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
import eventEmitter from './components/overlays/events'

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
      TopView.show(emitter,
        <OverlayViewPopup emitter={emitter}>
          <ActionSheet dismiss={()=>TopView.hideTop(emitter)}/>
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
