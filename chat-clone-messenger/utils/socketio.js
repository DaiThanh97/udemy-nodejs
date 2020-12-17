const socketio = require('socket.io');

let io;

init = server => {
    io = socketio(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
    return io;
};

getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = {
    init,
    getIO
}