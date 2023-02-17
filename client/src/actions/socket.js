import io from "socket.io-client";

export const socketIO = io(process.env.REACT_APP_SERVER_URL);