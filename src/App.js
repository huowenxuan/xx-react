import React, {PureComponent} from 'react';
import logo from './logo.svg';
import './App.css';
import Router from './Router'
import Overlay from './components/overlays/Overlay'
import TopView from "./components/overlays/TopView";
import ActionSheet from "./components/overlays/LightBox/ActionSheet/"
import overlay from "./components/overlays/";
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
