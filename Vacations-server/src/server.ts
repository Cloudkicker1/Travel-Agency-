import express from 'express';
import cors from 'cors';
import { SECRET } from "./routers/secret";
import { vacations } from "./routers/vacationsRouter";
import { users } from './routers/userRouter'
import expressJwt from 'express-jwt';
import http from 'http';
import { initSIS, SocketServer } from './SocketIo'
import SocketJwt from 'socketio-jwt';
import { JwtSocket } from './models/jwtSocket';
const PORT = 4000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(expressJwt({ secret: SECRET }).unless({ path: ['/users/register', '/users/login'] }));


app.use('/users', users);
app.use('/vacations', vacations);

app.get('/', (req, res) => {
    res.send('Hi there!');
});

const server = http.createServer(app)

initSIS(server)

SocketServer().sockets.on('connection', SocketJwt.authorize({ secret: SECRET })).on('authenticated', (socket: JwtSocket) => {
    const { currentUserType } = socket.decoded_token;
    if (currentUserType === 'admin') {
        socket.join('Admins');
    } else {
        socket.join('Users');
    }
})

server.listen(PORT, () => console.log(`Server is up at ${PORT}`));