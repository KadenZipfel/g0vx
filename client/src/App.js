import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import Index from './pages/Index';
import Gov from './pages/Gov';

import './layout/config/_base.sass';

class App extends Component {
  render() {
    return (
      <div>
        <Router basename={process.env.PUBLIC_URL}>
          <Route exact path="/" component={Index} />
          <Route path="/gov/:govId" component={Gov} />
      </Router>
      </div>
    );
  }
}

export default App;
