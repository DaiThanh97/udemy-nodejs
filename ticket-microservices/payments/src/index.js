const natsWrapper = require('./nats-wrapper');
const mongoose = require('mongoose');
const app = require('./app');
const { OrderCancelledListener, OrderCreatedListener } = require('./events/listener/order.listener');

const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is missing!');
    }

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

        // Listeners
        new OrderCreatedListener(client).listen()
        new OrderCancelledListener(client).listen()

        // Connect database
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to DB");
        app.listen(3000, () => {
            console.log('Tickets Service is listening on port 3000!');
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

start();