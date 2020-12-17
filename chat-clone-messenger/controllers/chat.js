const socketio = require('./../utils/socketio');
const chatService = require('./../services/chat');

const EVENT_CHAT = "CHAT";
const ACTION = {
    LOGIN: "LOGIN"
}

exports.initSocketIO = server => {
    const io = socketio.init(server);
    io.on('connection', socket => {
        console.log("Client connect 123");

        socket.on(EVENT_CHAT, reqObj => {
            const { action, data } = reqObj;
            switch (action) {
                case ACTION.LOGIN: {
                    const mess = chatService.loginChat(data.token);
                    socket.emit("RESPONSE", mess);
                    break;
                }
            }
        });
    });
}