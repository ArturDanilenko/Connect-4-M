import React, {Component} from 'react';
import {Jumbotron, Button} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Redirect} from "react-router-dom";

class About extends Component{

    _isMounted = false;

    static propTypes={
        isAuthenticated: PropTypes.bool
    }
    
    state = {
        redirect: false
    }

    toLobby = () =>{
        this.context.location.transitionTo('lobby');
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/leaderboard'/>
        }
    }

    redirectToLeaderboard = (e) =>{
        e.preventDefault();
        if(this._isMounted)this.setState({redirect: true});
    }

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }


    render(){
        return (
            <div>
            {this.renderRedirect()}
            <Jumbotron className="mb-0">
                <h1 className="display-3">Hello!</h1>
                <p className="lead">Welcome to a modified version of connect 4 where the boundaries aren't limitted by 7 tiles</p>
                <hr className="my-2" />
                <p>
                    How to play: </p><hr/><p>
                    &bull; Register or login into your account <br/>
                    &bull; Go to the lobby<br/>
                    &bull; Create a room with the desired dimensions via left panel. Once you make a room, you will see its name appear on the right panel<br/>
                    &bull; Enter the room name into the field (on the right panel) and press join room. The game will start once another player joins your room.<br/>
                    &bull; If you disconnect or refresh a page during the game, room will automatically close.</p>
                    <Button color="secondary" onClick={this.redirectToLeaderboard}>View leaderboard</Button>
                    <hr/>
                    <p>
                    Release notes: </p><hr/><p>
                    &bull; 27.06.20 - 1.1: <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&bull; Mobile experience improvement <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&bull; Display issues fixed <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&bull; Added leaderboard <br/>
                    &bull; 26.06.20 - 1.0: <br/> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&bull; Initial Release</p><hr/><p><br/>
                    If you have any suggestions, feel free to drop them in the chat (lobby). *i can still see it even if it overflows

                </p>
                <p className="lead">
                <a href="https://github.com/ArturDanilenko"><Button color="primary">Source Code</Button></a>
                
                </p>
            </Jumbotron>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{})(About);
