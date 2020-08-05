import React, {PureComponent, Component} from 'react'
import {Router as BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Provider} from "react-redux"
import store from "./store"
import * as querystring from "querystring"

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

  history.toEdit = (...args) => pushTo(routes.edit, ...args)
  history.toNew = () => pushTo(routes.new)
  history.toDrafts = () => pushTo(routes.drafts)
  history.replaceToDrafts = () => replace(routes.drafts)
}

export default class Router extends Component {
  history
  props: any

  constructor(props) {
    super(props)
    this.history = props.history || createBrowserHistory()
    initRoutes(this.history)
  }

  addRoute(path, Component) {
    const {globalState} = this.props
    const user = globalState.loginReducer
    return (
      <Route exact path={path}>
        <Component globalState={globalState} user={user}/>
      </Route>
    )
  }

  componentWillReceiveProps(nextProps, nextContext: any): void {
    // console.log(nextProps, 'sssss')
  }

  render() {
    // console.log(this.props.globalEventDistributor.getState().loginReducer.userId, 'sssss')
    return (
      <Provider store={this.props.store || store}>
        <BrowserRouter history={this.history}>
          <Switch>
            {this.addRoute(routes.root, PostNew)}
            {this.addRoute(routes.new, PostNew)}
            {this.addRoute(routes.edit, PostEdit)}
            {this.addRoute(routes.drafts, Draft)}
            {/*<Route exact path="/create/applinks" component={AppLink}/>*/}
            <Redirect to={routes.root}/>
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}
