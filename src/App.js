import React, {PureComponent} from 'react';
import './App.less';
import Router from './Router'
import TopView from "./components/overlays/TopView";
import ReactDOM from "react-dom";
import 'lib-flexible'

let node = document.createElement("div")
document.body.appendChild(node);
ReactDOM.render(
  <TopView/>,
  node
)

export default () => (
  <div>
    <Router/>
  </div>
)
