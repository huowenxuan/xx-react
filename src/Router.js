import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import PostEdit from './pages/PostEdit/'
import PostNew from './pages/PostNew/'
import AppLink from './pages/AppLink/'
import {createBrowserHistory} from 'history'
import {Provider} from "react-redux"
import store from "./store"

const history = createBrowserHistory()

export default (props) => (
  <Provider store={props.store || store}>
    <BrowserRouter history={props.history || history}>
      <Switch>
        <Route exact path="/" component={PostNew}/>
        <Route exact path="/postnew" component={PostNew}/>
        <Route exact path="/applinks" component={AppLink}/>
        <Route exact path="/postedit" component={PostEdit}/>
      </Switch>
    </BrowserRouter>
  </Provider>

);
