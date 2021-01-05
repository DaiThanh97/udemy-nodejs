const nats = require('node-nats-streaming');
const crypto = require('crypto');
const TicketCreatedListener = require('./events/ticket-created-listener');

console.clear();

const stan = nats.connect('ticketing', crypto.randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("Listener connected to NATS");

    stan.on('close', () => {
        console.log("NATS connection closed!");
        process.exit();
    });

    const listener = new TicketCreatedListener(stan);
    listener.listen();
});

// Watch for INTERUPT SIGNAL
process.on('SIGINT', () => stan.close());
// Watch for TERMINATE SIGNAL
process.on('SIGTERM', () => stan.close());