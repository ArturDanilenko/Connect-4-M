import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    Link
  } from "react-router-dom";
import {connect} from 'react-redux';
import About from '../components/About';
import Lobby from '../components/Lobby';
import Room from '../components/Room';
import Leaderboard from '../components/Leaderboard';
import AppNavbar from '../components/AppNavbar';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';

class RouterComponent extends Component {

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
                        <Route exact path="/">
                          <AppNavbar/>
                          <About />
                          <Link to="/lobby">
                            <Button color="primary" size="lg" block>Join Lobby</Button>
                          </Link>
                        </Route>
                        <Route path="/lobby">
                          <AppNavbar/>
                            {this.props.isAuthenticated===null?<Redirect to={{pathname: "/lobby",}}/> : 
                                ((this.props.isAuthenticated)? <Lobby/> : (
                                    <Redirect
                                      to={{
                                        pathname: "/",
                                      }}
                                    />
                                ))
                            }

                        </Route>
                        <Route path="/room">
                          <AppNavbar/>
                            {this.props.isAuthenticated===null?<Redirect to={{pathname: "/room",}}/> : 
                                ((this.props.isAuthenticated)? <Room/> : (
                                    <Redirect
                                      to={{
                                        pathname: "/",
                                      }}
                                    />
                                ))
                            }

                        </Route>
                        <Route path="/leaderboard">
                          <AppNavbar/>
                          <Leaderboard/>

                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{})(RouterComponent);
