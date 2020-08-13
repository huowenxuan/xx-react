import React, {useState, useEffect} from 'react'
import './App.less'
import Router from './Router'
import TopView from "./components/overlays/TopView"
import Fixed from "./components/Fixed"
import ReactDOM from "react-dom"
import {synchronize} from "./utils"
import 'lib-flexible'

let titles = []

function updateTitle() {
  if (titles.length === 0) return
  document.title = titles[titles.length - 1].title
}

window.insertTitle = (title) => {
  let id = Date.now()
  titles.push({id, title})
  if (title) updateTitle()
  return id
}
window.popTitle = (id) => {
  let index = titles.findIndex((item) => item.id === id)
  titles.splice(index, 1)
  updateTitle()
}

let topViewInstance = null
export default ({globalEventDistributor, history}) => {
  let isSingleSpa = !!window.singleSpaNavigate
  let [globalState, setGlobalState] = useState(isSingleSpa
    ? globalEventDistributor.getState()
    : {
      loginReducer: {
        userId: '1',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4YTE2NDkzMDRhZjE1OTgwYWZlNDk2YSIsInBob25lIjoiMTg4NDA5MTY3NDIiLCJpYXQiOjE1ODEzMjY4NDV9.jYNFFZWf0DcO5Wu5is21Htywds2zCDGH31YiLZSEeBw'
      }
    }
  )



  if (isSingleSpa) {
    console.log("***********")
    console.log(globalEventDistributor.getState())
    console.log(globalEventDistributor)

    globalEventDistributor.on("dispatch", () => {
      console.log("触发dispatch监听")
      console.log(globalEventDistributor.getState())
      setGlobalState(globalEventDistributor.getState())
    })

    if (!globalEventDistributor.getState().loginReducer.userId) {
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

    const eruda = require('eruda')
    const el = document.createElement('div')
    document.body.appendChild(el)
    eruda.init({container: el})

    return () => {
      titles = []
    }
  }, [])

  return (
    <div className='App'>
      <div className='container'>
        <Router
          globalState={globalState}
          history={history}
        />
      </div>
    </div>
  )
}

