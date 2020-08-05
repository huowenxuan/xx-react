import React, {useState, useEffect} from 'react'
import './App.less'
import Router from './Router'
import TopView from "./components/overlays/TopView"
import Fixed from "./components/Fixed"
import ReactDOM from "react-dom"
import 'lib-flexible'
import {synchronize} from './utils'

let node = document.createElement("div")
document.body.appendChild(node)
ReactDOM.render(
  <Fixed><TopView/></Fixed>,
  node
)

export default ({globalEventDistributor, history, store }) => {
  // const [globalState, setGlobalState] = useState(globalEventDistributor.getState())
  const [globalState, setGlobalState] = useState({
    loginReducer: {
      userId: '1'
    }
  })

  // useEffect(()=>{{
  //   setGlobalState(globalEventDistributor.getState())
  // }}, [globalEventDistributor])



  // console.log("***********");
  // console.log(globalEventDistributor.getState());
  // console.log(globalEventDistributor);
  // if (!globalEventDistributor.getState().loginReducer.userId) {
  //   synchronize().then((s) => {
  //     console.log(":::::::::::::::::::");
  //     console.log(s);
  //     console.log(globalEventDistributor.getState());
  //     console.log(":::::::::::::::::::");
  //     if (globalEventDistributor) {
  //       globalEventDistributor.dispatch({
  //         type: "login",
  //         payload: {
  //           userId: s.userId,
  //           token: s.token,
  //           userName: s.userName,
  //           phone: s.phone,
  //           openid: s.openid,
  //           avatar: s.avatar,
  //         },
  //       });
  //     }
  //   });
  // }

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

