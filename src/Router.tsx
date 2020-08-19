import React, {PureComponent, Component, useEffect} from 'react'
import {Router as BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {Provider} from "react-redux"
import store from "./store"
import * as querystring from "querystring"
import createHistory from "history/createBrowserHistory";

import PostEdit from './pages/PostEdit/'
import PostNew from './pages/PostNew/'
import AppLink from './pages/AppLink/'
import Draft from './pages/Draft/'

const prefix = '/create'
const routes = {
  root: prefix,
  new: prefix + '/new',
  edit: prefix + '/edit',
  drafts: prefix + '/drafts',
}

const initRoutes = (history) => {
  const {replace} = history
  let pushTo = (path, qs?, params?) => {
    qs = qs ? '?' + querystring.stringify(qs) : ''
    history.push({
      pathname: `${path}`,
      search: qs,
      ...(params || {})
    })
  }

  let replaceTo = (path, qs?, params?) => {
    qs = qs ? '?' + querystring.stringify(qs) : ''
    history.replace({
      pathname: `${path}`,
      search: qs,
      ...(params || {})
    })
  }

  history.toEdit = (...args) => pushTo(routes.edit, ...args)
  history.toNew = () => pushTo(routes.new)
  history.toDrafts = () => pushTo(routes.drafts)
  history.replaceToDrafts = () => replace(routes.drafts)

  history.replaceToShow = (postId)=> replace('/show/post/' + postId)
  history.replaceToEdit = (...args)=> replaceTo(routes.edit, ...args)
}

export default class Router extends PureComponent {
  history
  props: any

  constructor(props) {
    super(props)
    this.history = props.history || createHistory()
    initRoutes(this.history)
  }

  addRoute(path, Component) {
    const {globalState} = this.props
    const user = globalState.loginReducer
    return (
      <Route exact path={path}>
        <Component
          globalState={globalState}
          user={user}
        />
      </Route>
    )
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter history={this.history}>
          <Switch>
            {this.addRoute(routes.root, PostNew)}
            {this.addRoute(routes.new, PostNew)}
            {this.addRoute(routes.edit, PostEdit)}
            {this.addRoute(routes.drafts, Draft)}
            {/*<Route exact path="/create/applinks" component={AppLink}/>*/}
            {/*<Redirect to={routes.root}/>*/}
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
