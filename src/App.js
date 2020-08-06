import React, {useState, useEffect} from 'react'
import './App.less'
import Router from './Router'
import TopView from "./components/overlays/TopView"
import Fixed from "./components/Fixed"
import ReactDOM from "react-dom"
import {synchronize} from "./utils"
import 'lib-flexible'

let topNode = null
export default ({globalEventDistributor, history, store}) => {
  let [globalState, setGlobalState] = []

  if (globalEventDistributor) {
    [globalState, setGlobalState] = useState(globalEventDistributor.getState())
    useEffect(() => {
      setGlobalState(globalEventDistributor.getState())
    }, [globalEventDistributor])

    console.log("***********")
    console.log(globalEventDistributor.getState())
    console.log(globalEventDistributor)
    if (!globalEventDistributor.getState().loginReducer.userId) {
      synchronize().then((s) => {
        console.log(":::::::::::::::::::")
        console.log(s)
        console.log(globalEventDistributor.getState())
        console.log(":::::::::::::::::::")
        if (globalEventDistributor) {
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
        }
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
  }

  useEffect(() => {
    // 初始化后再加入，防止顺序在上，无法把app覆盖住
    topNode = document.createElement("div")
    document.body.appendChild(topNode)
    ReactDOM.render(
      <Fixed><TopView/></Fixed>,
      topNode
    )
    return () => document.body.removeChild(topNode)
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

