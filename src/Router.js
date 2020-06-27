import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';

export default () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/detail/:id" component={Detail}/>
    </Switch>
  </HashRouter>
);
