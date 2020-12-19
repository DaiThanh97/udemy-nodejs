const socket = io('http://localhost:5001');
console.log("VOO")
socket.emit("API", {
    endpoint: '/auth/login',
    method: 'POST',
    data: {
        email: 'yasuo@test.com',
        password: '123123'
    }
});

socket.on("API", msg => {
    console.log(msg);
})