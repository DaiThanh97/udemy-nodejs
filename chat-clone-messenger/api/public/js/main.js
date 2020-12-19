const socket = io('http://localhost:5001', {
    query: `token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmQ5Y2IwNGFkZWM2MTNlNGNiZGE3MjAiLCJuaWNrIjoiWWFzdW8gTmd1eWVuIiwiYXZhdGFyIjoicHVibGljXFxhdmF0YXJcXDE2MDgxMTA4MTI3ODYtYXZhdGFyLmpwZyIsImlhdCI6MTYwODM1MzUxMX0.oyT-CWOjgNiIPJv1kRGvvUeXBuHrWH5tXjyagEsHEmw`
});
let token = '';


onLogin = () => {
    console.log("CLICKK");
    socket.emit("REQUEST", { action: "CHAT", data: { roomId: "game", message: "Sao r ku ?" } });
}

onRegister = () => {
    socket.emit("REQUEST", { action: "CONNECT_ROOM", data: { roomId: "game" } });
}

socket.on("CHAT", msg => {
    console.log(msg);
})

socket.on('CONNECT_ROOM', msg => {
    console.log(msg);
})


// onLogin = () => {
//     axios({
//         method: "POST",
//         url: '/api/v1/auth/login',
//         data: {
//             email: inputEmail.value,
//             password: inputPassword.value
//         }
//     }).then(result => {
//         let { data } = result;
//         token = data.token;

//         // Send req to ws chat
//         socket.emit("EVENT_CHAT", {
//             action: ACTION.LOGIN,
//             data: { token }
//         });

//         window.location.replace("/chat.html");
//     }).catch(err => {
//     })
// }

// socket.on("RESPONSE", data => {
//     console.log(data);
// })