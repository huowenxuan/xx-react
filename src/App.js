import React, {useState, useEffect} from 'react'
import './App.less'
import Router from './Router'
import TopView from "./components/overlays/TopView"
import Fixed from "./components/Fixed"
import ReactDOM from "react-dom"
import {synchronize} from "./utils"
import 'lib-flexible'
import * as _ from 'lodash'

let topViewInstance = null
const App = ({globalEventDistributor, history, store}) => {
  let [globalState, setGlobalState] = []

  if (globalEventDistributor) {
    [globalState, setGlobalState] = useState(globalEventDistributor.getState())
    console.log("***********")
    console.log(globalEventDistributor.getState())
    console.log(globalEventDistributor)

    if (!globalEventDistributor.getState().loginReducer.userId) {
      setTimeout(() => {
        setGlobalState(globalEventDistributor.getState())
      }, 500)
      synchronize().then((s) => {
        console.log(":::::::::::::::::::")
        console.log(s)
        console.log(globalEventDistributor.getState())
        console.log(":::::::::::::::::::")
        globalEventDistributor.dispatch({
          type: "login",
          payload: {
            userId: s.userId,
            token: s.token,
            userName: s.userName,
            phone: s.phone,
            openid: s.openid,
            avatar: s.avatar,
          },
        })

      })
    }
  } else {
    // 本地开发
    [globalState, setGlobalState] = useState({
      loginReducer: {
        userId: '1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YTE2NDkzMDRhZjE1OTgwYWZlNDk2YSIsInBob25lIjoiMTg4NDA5MTY3NDIiLCJpYXQiOjE1ODEzMjY4NDV9.jYNFFZWf0DcO5Wu5is21Htywds2zCDGH31YiLZSEeBw'
      }
    })

    useEffect(() => {
      const eruda = require('eruda')
      const el = document.createElement('div')
      document.body.appendChild(el)
      eruda.init({container: el})
    }, [])
  }

  useEffect(() => {
    // 初始化后再加入，防止顺序在上，无法把app覆盖住
    if (!topViewInstance) {
      topViewInstance = document.createElement("div")
      document.body.appendChild(topViewInstance)
      ReactDOM.render(
        <Fixed><TopView/></Fixed>,
        topViewInstance
      )
    }
  }, [])

  return (
    <div className='App'>
      <div className='container'>
        <Router
          globalState={globalState}
          history={history}
          store={store}
        />
      </div>
    </div>
  )
}

export default App