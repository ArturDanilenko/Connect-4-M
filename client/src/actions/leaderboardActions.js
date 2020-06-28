import axios from 'axios';
import {GET_LEADERS, LEADERS_LOADING} from './types';
import {returnErrors} from './errorActions';

export const getLeaders = () => dispatch =>{
    dispatch(setLeadersLoading());
    axios
        .get('/api/leaderboard')
        .then(res => dispatch({
            type: GET_LEADERS,
            payload: res.data
        }))
        .catch(err=>dispatch(returnErrors(err.response.data, err.response.status)));
};

export const setLeadersLoading = () =>{
    return {
        type: LEADERS_LOADING
    }
};