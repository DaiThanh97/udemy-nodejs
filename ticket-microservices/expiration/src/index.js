require('dotenv').config();

const natsWrapper = require('./nats-wrapper');
const { OrderCreatedListener } = require('./events/listener/order.listener');

const start = async () => {
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID is missing!');
    }

    try {
        // Init Nats client
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        const client = natsWrapper.getClient();
        client.on('close', () => {
            console.log("NATS connection closed!");
            process.exit();
        });

        process.on('SIGINT', () => client.close());
        process.on('SIGTERM', () => client.close());

        new OrderCreatedListener(client).listen();
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

start();