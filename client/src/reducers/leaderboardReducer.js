import {GET_LEADERS, LEADERS_LOADING} from '../actions/types';

const initialState = {
    leaders:[],
    loading: false
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_LEADERS:
            return{
                ...state,
                leaders: action.payload,
                loading: false
            };
        case LEADERS_LOADING:
            return{
                ...state,
                loading: true
            }
        default:
            return state;
    }
}