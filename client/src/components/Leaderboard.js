import React, { Component } from 'react';
import {Container, ListGroup, ListGroupItem, Button} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getLeaders} from '../actions/leaderboardActions';
import {Redirect} from "react-router-dom";

class Leaderboard extends Component {

    _isMounted = false;

    state = {
        redirect: false
    }

    static propTypes={
        getLeaders: PropTypes.func.isRequired,
        leader: PropTypes.object.isRequired
    }

    componentDidMount(){
        this._isMounted = true;
        this.props.getLeaders();
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/'/>
        }
    }

    redirectToMain = (e) =>{
        e.preventDefault();
        if(this._isMounted)this.setState({redirect: true});
    }

    componentWillUnmount(){
        this._isMounted = false;
    }


    render() {
        const {leaders} = this.props.leader;
        return (
            <div>
            {this.renderRedirect()}

            <Container>
                <ListGroup>
                        {leaders.map(({name,wins})=>(
                                <ListGroupItem>                             
                                    {name+':'+wins}
                                </ListGroupItem>
                        ))}
                </ListGroup>
            </Container>
            <Button block color="secondary" onClick={this.redirectToMain}>Return to main page</Button>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    leader: state.leader,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{getLeaders})(Leaderboard);
