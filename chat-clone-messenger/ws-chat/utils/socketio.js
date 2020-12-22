const socketio = require('socket.io');

const { ACTION, EVENT } = require('../configs/ws');
const userService = require('../controllers/user');
const messageService = require('../controllers/message');
const Response = require('./response');

let io;
const options = {
    cors: { origin: "*", methods: ["GET", "POST"] }
}

// Init socketio
exports.init = server => {
    io = socketio(server, options);

    // Listen client connect
    io.on('connection', async socket => {
        try {
            console.log("Client connected: ", socket.id);
            // Handling request
            await onHandleRequest(socket);

            // Client disconnect
            socket.on('disconnect', (msg) => {
                console.log('Got disconnect!');
            });
        }
        catch (err) {
            const { message, status } = err;
            socket.emit(EVENT.ERROR, new Response(message, status || 500));
        }
    });
};

const onHandleRequest = socket => {
    socket.on(EVENT.REQUEST, async msg => {
        const { action, data } = msg;
        switch (action) {
            case ACTION.LOGIN: {
                // const { token } = data;
                // Check authenticate
                // socket.user = await userService.checkAuthen(token);
                // socket.emit(ACTION.LOGIN, new Response('Connect success!', 200, socket.user));


                const { name, room } = data;
                socket.join(room);
                socket.user = { name, room };
                socket.emit(ACTION.LOGIN, new Response('Login success!', 200, socket.user));
                break;
            }
            case ACTION.JOIN_ROOM: {
                const { roomId } = data;
                socket.join(roomId);
                const messages = await messageService.getMessages(roomId);
                socket.emit(ACTION.JOIN_ROOM, messages);
                break;
            }
            case ACTION.CHAT: {
                const { room, message } = data;
                // const { name } = socket.user;
                // await messageService.saveMessage(room, userId, nick, message);
                // io.in(room).emit(ACTION.CHAT, new Response('Login success!', 200, { name, message }));
                io.to(room).emit(ACTION.CHAT, new Response('Login success!', 200, { name: "Yasuo", message }))
                break;
            }
        }
    })
};
