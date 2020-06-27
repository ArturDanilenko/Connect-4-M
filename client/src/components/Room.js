import React, { Component } from 'react'
import {io} from './Socket';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import {removeRoomFromUser} from '../actions/roomActions';

class Room extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {
          player1: 1,
          player2: 2,
          playerNum: 2,
          currentPlayer: null,
          board: [],
          gameOver: false,
          message: '',
          colNum: 7,
          rowNum: 6,
          redirect: false,
          gameStarted: false,
          token: false
        };
        
        // Bind play function to App component
        this.play = this.play.bind(this);
      }

      static propTypes={
        roomName: PropTypes.string,
        removeRoomFromUser: PropTypes.func.isRequired
      }
      
      // Starts new game
      initBoard() {
        // Create a blank 6x7 matrix
        let board = [];
        for (let r = 0; r < this.state.rowNum; r++) {
          let row = [];
          for (let c = 0; c < this.state.colNum; c++) { row.push(null) }
          board.push(row);
        }
        
        if(this._isMounted)this.setState({
          board,
          currentPlayer: this.state.player1,
          gameOver: false,
          message: ''
        });
      }
      
      togglePlayer() {
        return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1;
      }
      
      play(c) {
        if (!this.state.gameOver) {
          // Place piece on board;
          let board = this.state.board;
          for (let r = this.state.rowNum-1; r >= 0; r--) {
            if (!board[r][c]) {
              board[r][c] = this.state.currentPlayer;
              break;
            }
          }
    
          // Check status of board
          let result = this.checkAll(board);
          if (result === this.state.player1) {
            if(this._isMounted){
              this.setState({ board, gameOver: true, message: 'Player 1 (red) wins!' });
              if(this.state.playerNum===1)io.emit('gameover',{playerWon: 1, room: this.props.roomName});
            }
          } else if (result === this.state.player2) {
            if(this._isMounted){
            this.setState({ board, gameOver: true, message: 'Player 2 (yellow) wins!' });
            if(this.state.playerNum===2)io.emit('gameover',{playerWon: 2, room: this.props.roomName});

          }
          } else if (result === 'draw') {
            if(this._isMounted&&this.state.playerNum===1){
              this.setState({ board, gameOver: true, message: 'Draw game.' });
              io.emit('gameover',{playerWon: 0, room: this.props.roomName});
            }
          } else {
            if(this._isMounted)this.setState({ board, currentPlayer: this.togglePlayer() });
          }
        } else {
          if(this._isMounted)this.setState({ message: 'Game over. Please start a new game.' });
        }
      }
      
      checkVertical(board) {
        // Check only if row is 3 or greater
        for (let r = 3; r < this.state.rowNum; r++) {
          for (let c = 0; c < this.state.colNum; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r - 1][c] &&
                  board[r][c] === board[r - 2][c] &&
                  board[r][c] === board[r - 3][c]) {
                return board[r][c];    
              }
            }
          }
        }
      }
      
      checkHorizontal(board) {
        // Check only if column is 3 or less
        for (let r = 0; r < this.state.rowNum; r++) {
          for (let c = 0; c < this.state.colNum-3; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r][c + 1] && 
                  board[r][c] === board[r][c + 2] &&
                  board[r][c] === board[r][c + 3]) {
                return board[r][c];
              }
            }
          }
        }
      }
      
      checkDiagonalRight(board) {
        // Check only if row is 3 or greater AND column is 3 or less
        for (let r = 3; r < this.state.rowNum; r++) {
          for (let c = 0; c < this.state.colNum-3; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r - 1][c + 1] &&
                  board[r][c] === board[r - 2][c + 2] &&
                  board[r][c] === board[r - 3][c + 3]) {
                return board[r][c];
              }
            }
          }
        }
      }
      
      checkDiagonalLeft(board) {
        // Check only if row is 3 or greater AND column is 3 or greater
        for (let r = 3; r < this.state.rowNum; r++) {
          for (let c = 3; c < this.state.colNum; c++) {
            if (board[r][c]) {
              if (board[r][c] === board[r - 1][c - 1] &&
                  board[r][c] === board[r - 2][c - 2] &&
                  board[r][c] === board[r - 3][c - 3]) {
                return board[r][c];
              }
            }
          }
        }
      }
      
      checkDraw(board) {
        for (let r = 0; r < this.state.rowNum; r++) {
          for (let c = 0; c < this.state.colNum; c++) {
            if (board[r][c] === null) {
              return null;
            }
          }
        }
        return 'draw';    
      }
      
      checkAll(board) {
        return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
      }

      handleLeave = (e) => {
        e.preventDefault();
        io.emit('leaveRoom',{name: this.props.roomName});
        if(this._isMounted)this.setState({redirect: true});
      }

      renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/lobby'/>
        }
      }
      
      componentDidMount() {
        this._isMounted = true;
        io.emit('requestBoard',{name: this.props.roomName});
        io.on('settings',(msg)=>{
          if(this._isMounted)this.setState({
            colNum: msg.cols,
            rowNum: msg.rows
          });
          this.initBoard();
        }); 
        io.on('startGame',()=>{
          if(this._isMounted)this.setState({gameStarted:true});
        });
        io.on('token',()=>{
          if(this._isMounted){
            this.setState({token: true, playerNum: 1});
          }
        });

        io.on('moveOccured',(msg)=>{
          const {col} = msg;
          if(this.state.token)this.play(col);
          if(this._isMounted){
            this.setState({token: !this.state.token});
          }
        });
        io.on('roomClosure',()=>{
          if(this._isMounted){
            this.setState({message: (this.state.message + ' The room will close in 30 seconds.')})
          }
          setTimeout(() => {
            io.emit('terminateRoom',{room: this.props.roomName});
            console.log(this.props.roomName);
            //this.props.removeRoomFromUser();
            if(this._isMounted)this.setState({redirect: true});
          }, 10000);
        });
        io.on('oppLeft',()=>{
          if(this._isMounted){
            this.setState({message: ('Opponent left and the room will close in 30 seconds.')})
          }
          setTimeout(() => {
            io.emit('terminateRoom',{room: this.props.roomName});
            console.log(this.props.roomName);
            //this.props.removeRoomFromUser();
            if(this._isMounted)this.setState({redirect: true});
          }, 10000);
        });
      }

      componentWillUnmount(){
        this._isMounted = false;
      }
      
      render() {
        return (
          <div>
            {this.renderRedirect()}
            {!this.state.gameStarted?<h1 id="text_1">Waiting for the opponent to join</h1> :<div>
              <table>
              <thead>
              </thead>
              <tbody>
                {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} token={this.state.token} room={this.props.roomName}/>))}
              </tbody>
            </table>
            
            <p className="message">{this.state.message?this.state.message:(!this.state.token?('Your turn'):'Opponents turn')}</p></div>
            }
            <Button onClick={this.handleLeave}>Leave Room</Button>
            
            
            
          </div>
        );
      }
}

const mapStateToProps = (state) => ({
  roomName: state.room.room
});

export default connect(mapStateToProps,{removeRoomFromUser})(Room);

// Row component
const Row = ({ row, play, token, room }) => {
  return (
    <tr>
      {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={play} token={token} room={room}/>)}
    </tr>
  );
};

const Cell = ({ value, columnIndex, play, token, room}) => {
  let color = 'white';
  if (value === 1) {
    color = 'red';
  } else if (value === 2) {
    color = 'yellow';
  }
    
  return (
    <td>
      <div className="cell" onClick={() => {
        if(!token){
          play(columnIndex);
          io.emit('move',{col: columnIndex, room: room});
        }
        }}>
        <div className={color}></div>
      </div>
    </td>
  );
};
