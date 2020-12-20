const socketio = require('socket.io');

const { ACTION, EVENT } = require('../configs/ws');
const userService = require('../services/user');
const Response = require('../utils/response');

// Init socketio
exports.init = server => {
    const io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Listen client connect
    io.on('connection', async socket => {
        try {
            // Handling request
            onHandleRequest(socket);

            // Client disconnect
            socket.on('disconnect', (msg) => {
                console.log('Got disconnect!', socket);
            });
        }
        catch (err) {
            return socket.emit(EVENT.ERROR, new Response('Internal error!', 500));
        }
    });
};

const onHandleRequest = (socket) => {
    socket.on(EVENT.REQUEST, msg => {
        const { action, data } = msg;
        switch (action) {
            case ACTION.LOGIN: {
                const { token } = data;
                // Check authenticate
                const user = await userService.checkAuthen(token);
                if (!user) {
                    return socket.emit(EVENT.ERROR, new Response('Internal error!', 500));
                }
                socket.emit(EVENT.CONNECT, new Response('Connect success!', 200, user));
                break;
            }
            case ACTION.JOIN_ROOM: {
                const { roomId } = data;
                socket.join(roomId);
                socket.emit(ACTION.JOIN_ROOM, `Connect room ${roomId} success!`);
                break;
            }
            case ACTION.CHAT: {
                const { roomId, message } = data;
                io.in(roomId).emit(ACTION.CHAT, message);
                break;
            }
        }
    });
}
