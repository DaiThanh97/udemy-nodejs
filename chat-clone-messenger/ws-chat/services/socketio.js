const socketio = require('socket.io');

const { ACTION } = require('./../configs/ws');
const { authen } = require('./../controllers/authen');

const Response = require('./../utils/response');

// Init socketio
const init = server => {
    const io = socketio(server);
    io.on('connection', socket => {
        console.log("Client connect");
        const { action, data } = socket;

        switch (action) {
            case ACTION.CONNECT_CHAT: {
                const user = authen(data.token);
                socket.user = user;
                socket.emit(ACTION.CONNECT_CHAT, new Response('Connect success!', 200));
                break;
            }
        }
    });
};

module.exports = {
    init
}
