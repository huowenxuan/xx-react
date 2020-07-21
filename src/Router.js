import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import PostEdit from './pages/PostEdit/';
import PostNew from './pages/PostNew/';
import AppLink from './pages/AppLink/';

export default () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={PostNew}/>
      <Route exact path="/postnew" component={PostNew}/>
      <Route exact path="/applinks" component={AppLink}/>
      <Route exact path="/postedit/" component={PostEdit}/>
      <Route exact path="/postedit/:id" component={PostEdit}/>
    </Switch>
  </HashRouter>
);
