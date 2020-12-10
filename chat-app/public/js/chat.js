const socket = io();

onSend = () => {
    const value = document.getElementById('inputMsg').value;
    document.getElementById('inputMsg').value = "";
    socket.emit('sendMessFromClient', value, (data) => {
        console.log(data);
    });
}

shareLocation = () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('shareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    })
}

socket.on('sendAll', data => {
    console.log(data);
})

socket.on('new', data => {
    console.log(data);
})

socket.on('mess', data => {
    console.log(data);
})

socket.on('sendLocation', data => {
    console.log(data);
})