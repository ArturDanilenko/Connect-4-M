const users = [];

//join user to the caht
function userJoin(id){
    const user={id,room: ''};

    users.push(user);

    return user;
}

function getCurrentUser(id){
    return users.find(user=>user.id===id);
}

//user leaves
function userLeave(id){
    const index = users.findIndex(user=>user.id===id);
    if(!index !== -1){
        return users.splice(index,1)[0];
    }
}

//get room users
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}

function getActiveUsers(){
    return users.length;
}

function putUserIntoRoom(id, room){
    const index = users.findIndex(user=>user.id===id);
    if(index !== -1){
        users[index].room = room;
    }
}

function getRoomOfUser(id){
    const index = users.findIndex(user=>user.id===id);
    if(index !== -1){
        return users[index].room;
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getActiveUsers,
    putUserIntoRoom,
    getRoomOfUser
}