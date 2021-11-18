
import React from 'react';
import { Router, Route, Switch } from 'react-router';
import {createBrowserHistory} from 'history';
import DisplayPlots from '../ui/DisplayPlots.js';
import Home from '../ui/Home.js'
import IndividualPlot from '../ui/IndividualPlot.js';
import PlotCompany from '../ui/PlotCompany';
import Company from '../ui/Company';
import Signup from '../ui/Signup';
import Login from '../ui/Login';
import About from '../ui/About';
import Contact from '../ui/Contact.js';


const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div className='route-render'>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="*/DisplayPlots" component={DisplayPlots} />
      <Route exact path="/IndividualPlot*" component={IndividualPlot} />
      <Route exact path="*/PlotCompany" component={PlotCompany} />
      <Route exact path="*/Signup" component={Signup} />
      <Route exact path="*/Login" component={Login} />
      <Route exact path="/Company*" component={Company} />
      <Route exact path="/About" component={About} />
      <Route exact path="/Contact" component={Contact} />

    </Switch>
    </div>
  </Router>
);
