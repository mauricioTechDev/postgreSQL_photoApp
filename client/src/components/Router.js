import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Welcome from './Welcome';
import NotFound from './NotFound';
import SignUp from './SignUp';
import LogIn from './LogIn';

// swith is to try all the routes and shor the correposing GUCCIII

const Router = () => (

  <BrowserRouter>
  <Switch>
  <Route exact path='/' component={Welcome} />
  <Route exact path='/signUp' component={SignUp} />
  <Route exact path='/logIn' component={LogIn} />
  <Route  component={NotFound} />
  </Switch>
  </BrowserRouter>
)


export default Router;
