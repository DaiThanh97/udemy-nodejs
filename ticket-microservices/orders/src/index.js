const natsWrapper = require('./nats-wrapper');
const mongoose = require('mongoose');
const app = require('./app');
const { TicketCreatedListener, TicketUpdatedListener } = require('./events/listener/ticket.listener');
const { ExpirationCompleteListener } = require('./events/listener/expiration.listener');
const { PaymentCreatedListener } = require('./events/listener/payment.listener');

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

        // Event listener
        new TicketCreatedListener(natsWrapper.getClient()).listen();
        new TicketUpdatedListener(natsWrapper.getClient()).listen();
        new ExpirationCompleteListener(natsWrapper.getClient()).listen();
        new PaymentCreatedListener(natsWrapper.getClient()).listen();

        // Connect database
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to DB");
        app.listen(3000, () => {
            console.log('Orders Service is listening on port 3000!');
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

start();