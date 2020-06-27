import React, {Component} from 'react';
import ChatComponent from './ChatComponent';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addUserToRoom, removeRoomFromUser} from '../actions/roomActions';

import {
    Redirect
  } from "react-router-dom";
import {io} from './Socket';
class Lobby extends Component{
    _isMounted = false;
    
    state = {
        redirect: false,
        roomName: '',
        colNum: 7,
        rowNum: 6,
        joinRoomName: ''
    }
    createRoom = (e) => {
        e.preventDefault();
        
        if(!(this.state.roomName.length>4&&this.state.roomName.length<15&&this.state.colNum>6&&this.state.colNum<21&&this.state.rowNum>5&&this.state.rowNum<21)){
            alert('Follow the instructions listed under the fields');
            return;
        } 

        io.emit('createRoom', {
            roomName: this.state.roomName.trim(),
            colNum: this.state.colNum,
            rowNum: this.state.rowNum
        });

        if(this._isMounted){
            this.setState({
                redirect: false
            })
        }
    }

    joinRoom = (e) =>{
        e.preventDefault();
        
        io.emit('checkRoomEx',{
            name: this.state.joinRoomName
        });

    }

    static propTypes={
        isAuthenticated: PropTypes.bool,
        roomName: PropTypes.string,
        addUserToRoom: PropTypes.func.isRequired,
        removeRoomFromUser: PropTypes.func.isRequired
    }

    handleRoomNameChange = (e) =>{
        if(this._isMounted)this.setState({roomName: e.target.value});
    }

    handleRowNumChange = (e) =>{
        if(this._isMounted)this.setState({rowNum: e.target.value});
    }

    handleColNumChange = (e) =>{
        if(this._isMounted)this.setState({colNum: e.target.value});
    }
    handleJoinRoomNameChange = (e) =>{
        if(this._isMounted)this.setState({joinRoomName: e.target.value});
    }
    handleRefresh = (e) =>{
        e.preventDefault();
        io.emit('refreshRooms',{});
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/room'/>
        }
    }

    componentDidMount(){
        this._isMounted = true;
        removeRoomFromUser();
        io.on('updateRooms', ({rooms})=>{
            outputRooms(rooms);
        })
        io.emit('refreshRooms',{});
        io.on('roomJoinFail',()=>{
            alert('The chosen room does not exist!');
        })
        io.on('roomFull',()=>{
            alert('The chosen room is full');
        })
        io.on('roomJoinSuccess',()=>{
            this.props.addUserToRoom(this.state.joinRoomName);
            if(this._isMounted)this.setState({redirect: true});
        });
        io.on('roomExists',()=>{
            alert('A room with the chosen name already exists.');
        });
        io.on('tooManyRooms',()=>{
            alert('There are too many rooms.');
        });
    }

    componentWillUnmount(){
        this._isMounted =false;
    }

    render(){

        return (
            <div>
                {this.renderRedirect()}
                <div className="createPanel"> 
                    <Form onSubmit={this.createRoom}>
                        <FormGroup>
                            <Label for="exampleName">Room Name</Label>
                            <Input type="text" name="name" id="exampleName" minLength="5" maxLength="14" value={this.state.roomName} onChange={this.handleRoomNameChange} />
                            <small className="form-text text-muted">Must be between 5 and 14 characters</small>
                        </FormGroup>
                        <FormGroup>
                            <Label for="columnNum">Number of Columns</Label>
                            <Input type="number" name="columns" id="columnNum" value={this.state.colNum} onChange={this.handleColNumChange} min="7" max="20"/>
                            <small className="form-text text-muted">Enter a number between 7 and 20</small>
                        </FormGroup>
                        <FormGroup>
                            <Label for="rowNum">Number of Rows</Label>
                            <Input type="number" name="rows" id="rowNum" value={this.state.rowNum} onChange={this.handleRowNumChange} min="6" max="20"/>
                            <small className="form-text text-muted">Enter a number between 6 and 20</small>
                        </FormGroup>
                        <Button>Create Room</Button>
                    </Form>
                </div>

                <div className="joinPanel"> 
                    <h4>List of open rooms: </h4><hr/>
                    <ul id="rooms">
                    </ul>
                    <Button onClick={this.handleRefresh}>Refresh</Button><hr/>
                    <Form onSubmit={this.joinRoom}>
                        <FormGroup>
                            <Label for="room">Room Name</Label>
                            <Input type="text" name="room" id="roomJoin" minLength="5" maxLength="14" value={this.state.joinRoomName} onChange={this.handleJoinRoomNameChange}/>
                            <small className="form-text text-muted">Enter the name of the room as it appears on the list.</small>
                        </FormGroup>
                        <Button>Join Room</Button>
                    </Form>
                </div>
                <ChatComponent/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated,
    roomName: state.room.room
});

export default connect(mapStateToProps,{addUserToRoom, removeRoomFromUser})(Lobby);

function outputRooms(rooms){
    const roomList = document.getElementById('rooms');
    if(rooms.length) {
        roomList.innerHTML =`
        ${rooms.map(room=>`<li>${room.name} - ${room.players}/2 players</li>`).join('')}`;
    }
    else{
        roomList.innerHTML ="No open rooms right now."; 
    }
}