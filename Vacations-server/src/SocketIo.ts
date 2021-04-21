import SocketIoServer, { Server } from 'socket.io';
import http from 'http';

let SIS: Server;

export function initSIS(server: http.Server) {
    SIS = SocketIoServer(server);
}

export function SocketServer(): Server {
    return SIS;
}