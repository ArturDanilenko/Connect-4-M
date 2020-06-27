import SOCKETIO from "socket.io-client";
import config from './config';

export const io = SOCKETIO(config[process.env.NODE_ENV].endpoint);