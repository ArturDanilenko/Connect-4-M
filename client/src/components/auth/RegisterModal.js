import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {register} from '../../actions/authActions';
import {clearErrors} from '../../actions/errorActions';


class RegisterModal extends Component {
    state = {
        modal: false,
        name: '',
        username: '',
        password:'',
        msg: null
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps){
        const {error, isAuthenticated} = this.props;
        if(error !== prevProps.error){
            //checck for register errors
            if(error.id === 'REGISTER_FAIL'){
                this.setState({msg: error.msg.msg});
            }
            else {
                this.setState({msg:null});
            }
        }
        if(this.state.modal){
            if(isAuthenticated){
                this.toggle();
            }
        }
    };

    toggle = () =>{
        //clear errors 
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = (e) =>{
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmit = e =>{
        e.preventDefault();
        
        const {name, username, password} = this.state;

        //Create user object
        const newUser= {
            name,
            username,
            password
        };
        //Attempt to register
        this.props.register(newUser);

    };

    render() { 
        return (
            <div>
               <NavLink onClick={this.toggle} href='#'>
                   Register
               </NavLink>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader
                        toggle={this.toggle}
                    >
                        Register
                    </ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (<Alert color="danger">{this.state.msg}</Alert>):null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input 
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="In-game name"
                                    onChange={this.onChange}
                                    className="mb-3"
                                />
                                <Label for="username">Username</Label>
                                <Input 
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Username for login"
                                    onChange={this.onChange}
                                    className="mb-3"
                                />
                                <Label for="password">Password</Label>
                                <Input 
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    onChange={this.onChange}
                                    className="mb-3"
                                />
                                <Button
                                    color="dark"
                                    style={{marginTop:'2rem'}}
                                    block
                                >Register</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps,{register, clearErrors})(RegisterModal);
