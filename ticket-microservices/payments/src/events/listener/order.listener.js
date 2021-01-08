const { Listener, Subject, OrderStatus } = require('@tioticket/common');
const Order = require('./../../models/Order');

const queueGroupName = 'payments-service';

class OrderCreatedListener extends Listener {
    subject = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const order = new Order({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });
        await order.save();

        msg.ack();
    };
}

class OrderCancelledListener extends Listener {
    subject = Subject.OrderCancelled;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!order) {
            throw new Error('Order not found!');
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        msg.ack();
    };
}

module.exports = {
    OrderCreatedListener,
    OrderCancelledListener
}