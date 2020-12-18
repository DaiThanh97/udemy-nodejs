const socket = io();
let token = '';

onLogin = () => {
    axios({
        method: "POST",
        url: '/api/v1/auth/login',
        data: {
            email: inputEmail.value,
            password: inputPassword.value
        }
    }).then(result => {
        let { data } = result;
        token = data.token;

        // Send req to ws chat
        socket.emit(EVENT_CHAT, {
            action: ACTION.LOGIN,
            data: { token }
        });

        window.location.replace("/chat.html");
    }).catch(err => {
    })
}

socket.on("RESPONSE", data => {
    console.log(data);
})