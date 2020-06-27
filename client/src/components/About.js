import React, {Component} from 'react';
import {Jumbotron, Button} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
// import { useHistory } from 'react-router-dom';

class About extends Component{

    static propTypes={
        isAuthenticated: PropTypes.bool
    }

    toLobby = () =>{
        this.context.location.transitionTo('lobby');
    }

    render(){
        return (
            <Jumbotron>
                <h1 className="display-3">Hello!</h1>
                <p className="lead">Welcome to my version of the connect 4 game which is done an individual project using MERN stack~</p>
                <hr className="my-2" />
                <p>Besides being a platform for a game, it has a distinction where the in-game borders are customizable, in other words, horizontal space isn't limitted by 7 squares.</p>
                <p className="lead">
                <a href="https://github.com/ArturDanilenko"><Button color="primary">Learn More</Button></a>
                </p>
            </Jumbotron>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{})(About);
