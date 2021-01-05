const nats = require('node-nats-streaming');
const TicketCreatedPublisher = require('./events/ticket-created-publisher');

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    // Fucntion will be executed after connected to the NATS Streaming Server
    // console.log("Publisher connected to NATS");
    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });

    // // Publish data
    // stan.publish('ticket:created', data, () => {
    //     // Function will invoked after published data
    //     console.log("Event published");
    // });

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 100
        });
    } catch (err) {
        console.log(err);
    }
});