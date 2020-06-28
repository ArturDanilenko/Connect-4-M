import {combineReducers} from 'redux';
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import roomReducer from './roomReducer';
import leaderboardReducer from './leaderboardReducer';

export default combineReducers({
    item: itemReducer,
    error: errorReducer,
    auth: authReducer,
    room: roomReducer,
    leader: leaderboardReducer
});