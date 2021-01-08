const { Listener, Subject, OrderStatus } = require('@tioticket/common');

const Order = require('./../../models/Order');
const { OrderCancelledPublisher } = require('./../../events/publisher/order.publisher');

const queueGroupName = 'orders-service';

class ExpirationCompleteListener extends Listener {
    subject = Subject.ExpirationComplete;
    queueGroupName = queueGroupName

    onMessage = async (data, msg) => {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error('Order not found!');
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();
    };
}

module.exports = {
    ExpirationCompleteListener
}