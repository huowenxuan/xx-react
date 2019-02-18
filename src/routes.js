import React from 'react'
import {Route, HashRouter, Switch} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Wizard from './components/Wizard'
import Cards from './components/Cards'
import Main from './components/Main'
import Signup from './components/Signup'
import ScrollToTop from './components/ScrollTop'
import NotePage from './components/NotePage'

export const Menu = [
  {
    label: "Note",
    pathname: "/",
    component: NotePage,
  },
  {
    label: "Main",
    pathname: "/main",
    component: Main,
  },
  {
    label: "Dashboard",
    pathname: "/dashboard",
    component: Dashboard,
  },
  {
    label: "Signup",
    pathname: "/signup",
    component: Signup,
  },
  {
    label: "Wizard",
    pathname: "/wizard",
    component: Wizard,
  },
  {
    label: "Cards",
    pathname: "/cards",
    component: Cards,
  }
];

export default props => (
  <HashRouter>
    <ScrollToTop>
      <Switch>
        {Menu.map(({label, component, pathname}) =>
          <Route exact path={pathname} component={component}/>)}
      </Switch>
    </ScrollToTop>
  </HashRouter>
)