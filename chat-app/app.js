const path = require('path');
const http = require('http');

const express = require('express');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
// const logger = require('morgan');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    socket.broadcast.emit('new', 'New client join!');

    socket.on('sendMessFromClient', (data, callback) => {
        io.emit('sendAll', data);
        callback('Server nhan dc roi');
    })

    socket.on('shareLocation', data => {
        io.emit('sendLocation', `https://www.google.com/maps?q=${data.latitude},${data.longitude}`);
    })

    socket.on('disconnect', () => {
        io.emit('mess', 'A user has left!')
    })
})

server.listen(process.env.PORT || 8080);
// app.listen(process.env.PORT || 8080);
