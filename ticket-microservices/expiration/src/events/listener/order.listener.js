const { Listener, Subject } = require('@tioticket/common');

const expirationQueue = require('./../../queues/expiration.queue');

const queueGroupName = "expiration-service"

class OrderCreatedListener extends Listener {
    subject = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const { expiresAt } = data;
        const delay = new Date(expiresAt).getTime() - new Date().getTime();

        // Queue a job to Redis
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        msg.ack();
    };
}

module.exports = {
    OrderCreatedListener
}