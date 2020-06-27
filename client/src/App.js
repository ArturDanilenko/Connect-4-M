import React, {Component} from 'react';
import Router from './router/RouterComponent';
import {Provider} from 'react-redux';
import store from './store';
import {loadUser} from './actions/authActions';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  componentDidMount(){
    store.dispatch(loadUser());
  }

  render(){
    return(
      <Provider store={store}>
          <Router/>
      </Provider>
    );
  }
}

export default App;
