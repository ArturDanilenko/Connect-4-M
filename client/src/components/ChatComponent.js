import React from 'react';
import {io} from './Socket';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from './BottomBar';
import '../App.css';

class ChatComponent extends React.Component {
  _isMounted = false;

  constructor(props) {
      super(props);
  
      this.state = {
        chat: [],
        content: '',
        name: '',
        activeUsers: ''
      };
    }

  static propTypes = {
      auth: PropTypes.object.isRequired
  }


  componentDidMount() {
    this._isMounted = true;
    // io = io(config[process.env.NODE_ENV].endpoint);
    io.emit('userJoin');
    
    io.on('activeUsers',(msg)=>{
      if(this._isMounted)this.setState((state)=>({
        activeUsers: msg.users
      }));
      //console.log(this.state.activeUsers);
    });

    //Load the last 10 messages in the window.
    io.on('init', (msg) => {
      if(this._isMounted)this.setState((state) => ({ 
        chat: [...state.chat, ...msg.reverse()],
      }), this.scrollToBottom);
    });

    // Update the chat if a new message is broadcasted.
    io.on('push', (msg) => {
      if(this._isMounted)this.setState((state) => ({
        chat: [...state.chat, msg],
      }), this.scrollToBottom);
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  // Save the message the user is typing in the input field.
  handleContent(event) {
    if(this._isMounted)this.setState({
      content: event.target.value,
    });
  }

  //
  handleName(event) {
    const {user} = this.props.auth;
    if(this._isMounted)this.setState({
      name: user.name,
    });
  }

  // When the user is posting a new message.
  handleSubmit(event) {
    //console.log(event);
    const {user} = this.props.auth;
    
  

    // Prevent the form to reload the current page.
    event.preventDefault();

    io.emit('message', {
      name: user.name,
      content: this.state.content,
    });

    if(this._isMounted)this.setState((state) => {
      //console.log(state);
      //console.log('this', io);
      // Send the new message to the server.

      // Update the chat with the user's message and remove the current message.
      return {
        chat: [...state.chat, {
          name: user.name,
          content: state.content,
        }],
        content: '',
      };
    }, this.scrollToBottom);
  }

  // Always make sure the window is scrolled down to the last message.
  scrollToBottom() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  render() {
    return (
      <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el, index) => {
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          // handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          activeUsers={this.state.activeUsers}
        />
      </div>
    );
  }
};

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps,null)(ChatComponent);