import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import PostEdit from './pages/PostEdit/';
import PostNew from './pages/PostNew/';

export default () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={PostNew}/>
      <Route exact path="/postnew" component={PostNew}/>
      <Route exact path="/postedit/" component={PostEdit}/>
      <Route exact path="/postedit/:id" component={PostEdit}/>
    </Switch>
  </HashRouter>
);
