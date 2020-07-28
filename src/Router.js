import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import PostEdit from './pages/PostEdit/'
import PostNew from './pages/PostNew/'
import AppLink from './pages/AppLink/'
import createHistory from 'history/createBrowserHistory'
import {Provider} from "react-redux"
import {storeInstance} from "./store"

const history = createHistory()

export default (props) => (
  <Provider store={props.store || storeInstance}>
    <BrowserRouter history={props.history || history}>
      <Switch>
        <Route exact path="/" component={PostNew}/>
        <Route exact path="/postnew" component={PostNew}/>
        <Route exact path="/applinks" component={AppLink}/>
        <Route exact path="/postedit/" component={PostEdit}/>
        <Route exact path="/postedit/:id" component={PostEdit}/>
      </Switch>
    </BrowserRouter>
  </Provider>

);
