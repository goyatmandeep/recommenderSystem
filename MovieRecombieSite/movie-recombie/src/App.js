import React from 'react'
import LandingPage from './views/LandingPage/LandingPage'
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router";
var hist = createBrowserHistory();

export default class App extends React.Component {
  render() {
    return (
      <Router history={hist}>
      <Switch>
      
        <Route path="/" component={LandingPage} />
       
     {/*   <Route path="/error-page" component={ErrorPage} /> */}
     
      </Switch>
    </Router>
    )
  }
 
}
