import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import {connect} from 'react-redux';
import About from './About';
import Lobby from './Lobby';
import PropTypes from 'prop-types';

class Mainpage extends Component {
    state = {
        modal: false,
        name: ''
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool
    }

    toggle = () =>{
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };

    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/">
                            <About />
                        </Route>
                        <Route path="/login">
                            {this.props.isAuthenticated ? <Lobby/> : <Lobby/>} 
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{})(Mainpage);
