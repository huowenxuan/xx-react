import React from 'react'
import {Router as BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Provider} from "react-redux"
import store from "./store"

import PostEdit from './pages/PostEdit/'
import PostNew from './pages/PostNew/'
import AppLink from './pages/AppLink/'
import Draft from './pages/Draft/'

const history = createBrowserHistory()

export default (props) => (
  <Provider store={props.store || store}>
    <BrowserRouter history={props.history || history}>
      <Switch>
        <Route exact path="/create" component={PostNew}/>
        <Route exact path="/create/new" component={PostNew}/>
        {/*<Route exact path="/create/applinks" component={AppLink}/>*/}
        <Route exact path="/create/edit" component={PostEdit}/>
        <Route exact path="/create/drafts" component={Draft}/>
        <Redirect to="/create"/>
      </Switch>
    </BrowserRouter>
  </Provider>

);
