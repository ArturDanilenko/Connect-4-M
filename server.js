const express = require('express');
const app = express();
const http = require ('http').Server(app);
const mongoose = require('mongoose');
const path = require('path');
const config = require ('config');
const io = require('socket.io')(http);
const formatMessage = require('./utils/messages');

const {userJoin, userLeave, getActiveUsers, putUserIntoRoom, getRoomOfUser, getCurrentUser} = require('./utils/users');
const {createRoom, deleteRoom, getRoomCols, getRoomRows, getRooms, getRoom, playersInRoom,joinRoom,leaveRoom} = require ('./utils/rooms');

const uri = "mongodb+srv://artur000918:5xDYcuOprsEHiyNR@cluster-ymnb6.mongodb.net/connect4?retryWrites=true&w=majority";

//Body parser middleware
app.use(express.json());

//DB config
const db = config.get('mongoURI');

// //connect to mongo
mongoose
    .connect(db,{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
    .then(()=>console.log('MongoDB connected...'))
    .catch(err=>console.log(err));

const Message = require('./Message');
const mongoose2 = require('mongoose');

mongoose2.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}).then(()=>console.log('MongoDB2 connected...'))
.catch(err=>console.log(err));

//Use routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/leaderboard', require('./routes/api/leaderboard'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const Item = require('./models/User');
const User = require('./models/User');

io.on('connection', (socket) => {
    

    //Lobby init
    socket.on('userJoin',()=>{
      if(!getCurrentUser(socket.id)){
        const user = userJoin(socket.id);
      }
      socket.join('lobby');
      
      putUserIntoRoom(socket.id, 'lobby');
      io.to('lobby').emit('activeUsers', {users: getActiveUsers()});

      Message.find().sort({createdAt: -1}).limit(10).exec((err, messages) => {
        if (err) return console.error(err);
    
        // Send the last messages to the user.
        socket.emit('init', messages);
      });
    });

    //Check room existance
    socket.on('checkRoomEx',(msg)=>{
      const {name} = msg;
      if(getRoom(name)){
        if(playersInRoom(name) === 2)io.to(socket.id).emit('roomFull');
        else{
          joinRoom(name);
          socket.leave('lobby');
          putUserIntoRoom(socket.id, name);
          socket.join(name);
          io.to(socket.id).emit('roomJoinSuccess');
        }
      }
      else io.to(socket.id).emit('roomJoinFail');
    });

    socket.on('reqStartGame',()=>{
      io.to(socket.id).emit('startGame');
    });
    socket.on('reqToken',()=>{
      io.to(socket.id).emit('token');
    });

    socket.on('requestBoard', (msg)=>{
      const {name} = msg;
      if(playersInRoom(name) === 2) {
        io.to(name).emit('startGame');
        io.to(socket.id).emit('token');
      }
      io.to(name).emit('settings',{
        cols: getRoomCols(name),
        rows: getRoomRows(name)
      });
    });

    socket.on('createRoom',(msg)=>{
      const {roomName, colNum,rowNum} = msg;

      if(getRoom(roomName))io.to(socket.id).emit('roomExists');
      else if(getRooms().length>10)io.to(socket.id).emit('tooManyRooms');
      else {
        const room = createRoom(roomName,colNum,rowNum);

        io.to(socket.id).emit('updateRooms',{
          rooms: getRooms()
        });
      }
    });
    
    socket.on('refreshRooms',()=>{
      io.to(socket.id).emit('updateRooms',{
        rooms: getRooms()
      });
    })

    socket.on('move',(msg)=>{
      const {col, room} = msg;
      io.to(room).emit('moveOccured',{col: col});
    });

    socket.on('gameover', (msg)=>{
      const {username, room} = msg;
      var wins;
      if(username){
        User.findOne({"username":username})
        .then(user=> {
          if(user.wins)wins = user.wins + 1;
          else wins = 1;
          User.updateOne({username: username}, {wins: wins}, {upsert: true}, function(err, doc) {
 
          });
        });
        //console.log(wins);
        
      }
      io.to(room).emit('roomClosure');
    });

    socket.on('terminateRoom', (msg)=>{
      const {room} = msg;
      socket.leave(room);
      socket.join('lobby');
      putUserIntoRoom(socket.id, 'lobby');
      deleteRoom(room);
    });

    //socket.broadcast.emit('activeUsers', io.clients.length);

    // Get the last 10 messages from the database.
    
    socket.on('leaveRoom', (msg)=>{
      if(msg.name){
        if(playersInRoom(msg.name)===2){
          io.to(msg.name).emit('oppLeft');
        }
        else if(playersInRoom(msg.name)===1) deleteRoom(msg.name);
      }
      leaveRoom(msg.name);
      socket.leave(msg.name);
      putUserIntoRoom(socket.id,'lobby');
      socket.join('lobby');
    });
  
    // Listen to connected users for a new message.
    socket.on('message', (msg) => {
      // Create a message with the content and the name of the user.
      const message = new Message({
        content: msg.content,
        name: msg.name,
      });

  
      // Save the message to the database.
      message.save((err) => {
        if (err) return console.error(err);
      });
  
      // Notify all other users about a new message.
      socket.broadcast.emit('push', msg);
    });

    socket.on('disconnect', ()=>{
      const name = getRoomOfUser(socket.id);
      if(name){
        if(playersInRoom(name)===2){
          io.to(name).emit('oppLeft');
        }
      }
      else if(name&&playersInRoom(name)===1){
        deleteRoom(name);
      }
      leaveRoom(name);

      const user = userLeave(socket.id);

      io.to('lobby').emit('activeUsers', {users: getActiveUsers()});
      
    });
  });

//Servee static assets if in production 
if(process.env.NODE_ENV==='production'){
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res) =>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}

const port = process.env.PORT||5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));
http.listen(port, () => {
  console.log('listening on *:' + port);
}); 