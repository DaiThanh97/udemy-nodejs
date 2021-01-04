const nats = require('node-nats-streaming');
const crypto = require('crypto');

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

    // Options for subscription
    const options = stan.subscriptionOptions().setManualAckMode(true);

    // Subscribe to a channel
    const subscription = stan.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        options
    );

    subscription.on('message', (msg) => {
        const data = msg.getData();
        console.log('Receive: ', data);

        msg.ack();
    });
});

// Watch for INTERUPT SIGNAL
process.on('SIGINT', () => stan.close());
// Watch for TERMINATE SIGNAL
process.on('SIGTERM', () => stan.close());