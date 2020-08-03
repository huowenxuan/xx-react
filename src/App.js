import React, {PureComponent} from 'react'
import './App.less'
import Router from './Router'
import TopView from "./components/overlays/TopView"
import Fixed from "./components/Fixed"
import ReactDOM from "react-dom"
import 'lib-flexible'

let node = document.createElement("div")
document.body.appendChild(node)
ReactDOM.render(
  <Fixed><TopView/></Fixed>,
  node
)

export default () => (
  <div className='App'>
    <div className='container'>
      <Router/>
    </div>
  </div>
)
