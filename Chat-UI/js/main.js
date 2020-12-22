const socket = io('http://localhost:5001');

let currentName = '';
let currentRoom = '';

onLogin = () => {
    const inputName = document.getElementById('inputName').value;
    const inputRoom = document.getElementById('inputRoom').value;

    socket.emit("REQUEST", {
        action: 'LOGIN',
        data: {
            name: inputName,
            room: inputRoom
        }
    });
}

onSendMessage = () => {
    const inputMessage = document.getElementById('inputMessage').value;

    socket.emit("REQUEST", {
        action: 'CHAT',
        data: {
            room: inputMessage,
            message: "E dcm"
        }
    });
}

socket.on("LOGIN", response => {
    console.log(response);
    const info = document.getElementById('info');
    const { status, data } = response;

    if (status === 200) {
        const { name, room } = data;
        currentRoom = room;
        currentName = name;
        info.innerHTML = `<span class="display-5 text-success">Tên: ${name}</span><span class="text-info"> Phòng: ${room}</span>`
    }
})

socket.on("CHAT", response => {
    console.log(response);
    // const messageContent = document.getElementById('messge-content');
    // messageContent.scrollTop = messageContent.scrollHeight;
    // const { status, data: { name, message } } = response;
    // console.log(name, message);
    // if (status === 200) {
    //     if (name === currentName) {
    //         messageContent.innerHTML += `
    //             <div class="message-self">
    //                 <h5 class="mb-0">${currentName}</h5>
    //                 <span>${message}</span>
    //             </div>
    //         `;
    //     }
    //     else {
    //         messageContent.innerHTML += `
    //             <div class="message-friend">
    //                 <h5 class="mb-0">${name}</h5>
    //                 <span>${message}</span>
    //             </div>
    //         `;
    //     }
    // }
})

socket.on("ERROR", msg => {
    console.log(msg);
})