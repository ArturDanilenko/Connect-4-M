import {ADD_ROOM,REMOVE_ROOM} from './types';

//Return ERRORS
export const addUserToRoom = (room)=>{
    return {
        type: ADD_ROOM,
        payload: {room}
    };
};

export const removeRoomFromUser = () => {
    return {
        type: REMOVE_ROOM
    };
};