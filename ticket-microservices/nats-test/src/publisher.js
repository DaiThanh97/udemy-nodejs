const nats = require('node-nats-streaming');

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    // Fucntion will be executed after connected to the NATS Streaming Server
    console.log("Publisher connected to NATS");
    const data = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    });

    // Publish data
    stan.publish('ticket:created', data, () => {
        // Function will invoked after published data
        console.log("Event published");
    });
});