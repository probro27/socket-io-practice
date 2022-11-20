import express, { Application, Request, Response } from 'express';
const app: Application = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
import ioclient from 'socket.io-client';
const io = new Server(server);

let usersJoined = 0;

app.get('/', (_req: Request, res: Response) => {
    const socketClient = ioclient('http://localhost:3000');
    socketClient.on('connect', () => {
        usersJoined += 1;
        console.log('user connected!');
        let room = "room123";
        socketClient.emit('room', room);
    });
    socketClient.on('message', (message: string) => {
        console.log('Incoming message: ', message);
    });
    res.json({ 'data': `you are user ${usersJoined}` });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('room', (room: string) => {
        socket.join(room);
        console.log('room joined!');
        io.sockets.in(room).emit('message', `how you doin user: ${usersJoined} in room ${room}?`);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        usersJoined -= 1;
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
