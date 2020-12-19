const socketio = require('socket.io');
const socketioJwt = require('socketio-jwt');

const { ACTION, EVENT } = require('../configs/ws');
const userService = require('../services/user');

const Response = require('../utils/response');

// Init socketio
const init = server => {
    const io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Check authen
    io.use(socketioJwt.authorize({
        secret: process.env.JWT_SECRET,
        handshake: true
    }));

    // Listen client connect
    io.on('connection', async socket => {
        // Get info user
        const user = await userService.getUser(socket.decoded_token, socket.id);
        if (!user) {
            return socket.emit(EVENT.ERROR, new Response('Internal error!', 500));
        }
        socket.emit(ACTION.CONNECT_CHAT, new Response('Connect success!', 200, user));

        // Handling request
        socket.on(EVENT.REQUEST, msg => {
            const { action, data } = msg;
            switch (action) {
                case ACTION.CONNECT_ROOM: {
                    const { roomId } = data;
                    socket.join(roomId);
                    socket.emit(ACTION.CONNECT_ROOM, `Connect room ${roomId} success!`);
                    break;
                }
                case ACTION.CHAT: {
                    const { roomId, message } = data;
                    io.in(roomId).emit(ACTION.CHAT, message);
                    break;
                }
            }
        });

        // Client disconnect
        socket.on('disconnect', (msg) => {
            console.log('Got disconnect!', socket);
        });
    });
};

module.exports = {
    init
}
