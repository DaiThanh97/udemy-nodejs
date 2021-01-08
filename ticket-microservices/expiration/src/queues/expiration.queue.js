const Queue = require('bull');

const { ExpirationCompletePublisher } = require('./../events/publisher/expiration.publisher');
const natsWrapper = require('./../nats-wrapper');


const expirationQueue = new Queue('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    }
});

expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper).publish({
        orderId: job.data.orderId
    });
});

module.exports = expirationQueue;