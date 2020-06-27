import {ADD_ROOM, REMOVE_ROOM} from '../actions/types';

const initialState = {
    room: ''
}
export default function (state = initialState, action){
    switch(action.type){
        case ADD_ROOM:
            return{
                room: action.payload.room
            };
        case REMOVE_ROOM:
            return{
                room: ''
            };
        default:
            return state;
    }
}