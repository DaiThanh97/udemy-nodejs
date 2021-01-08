const { Listener, OrderStatus, Subject } = require('@tioticket/common');

const Order = require('./../../models/Order');

const queueGroupName = 'orders-service';

class PaymentCreatedListener extends Listener {
    subject = Subject.PaymentCreated;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error('Order not found!');
        }

        order.status = OrderStatus.Complete;
        await order.save();

        msg.ack();
    };
}

module.exports = {
    PaymentCreatedListener
}