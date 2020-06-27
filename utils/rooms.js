const rooms = [];

//join user to the caht
function createRoom(name, colNum, rowNum){
    const room={name, colNum, rowNum, players: 0};

    rooms.push(room);

    return room;
}

//user leaves
function deleteRoom(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        return rooms.splice(index,1)[0];
    }
}

function getRoomCols(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        return rooms[index].colNum;
    }
}
function getRoom(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        return true;
    }
    else return false;
}
function playersInRoom(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        return rooms[index].players;
    }
}

function joinRoom(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        rooms[index].players++;
    }
}

function leaveRoom(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        rooms[index].players--;
    }
}

function getRoomRows(name){
    const index = rooms.findIndex(room=>room.name===name);
    if(index !== -1){
        return rooms[index].rowNum;
    }
}


function getRooms(){
    return rooms;
}

module.exports = {
    createRoom,
    deleteRoom,
    getRoomCols,
    getRoomRows,
    getRooms,
    getRoom,
    playersInRoom,
    joinRoom,
    leaveRoom
}