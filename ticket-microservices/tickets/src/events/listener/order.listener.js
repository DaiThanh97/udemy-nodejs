const { Listener, Subject } = require('@tioticket/common');
const Ticket = require('./../../models/Ticket');
const { TicketUpdatedPublisher } = require('./../publisher/ticket.publisher');

const queueGroupName = 'tickets-service'

class OrderCreatedListener extends Listener {
    subject = Subject.OrderCreated;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const { id: orderId } = data;
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found!');
        }

        ticket.orderId = orderId;
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        // Acknowledge to NATS
        msg.ack();
    }
}

class OrderCancelledListener extends Listener {
    subject = Subject.OrderCancelled;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found!');
        }

        ticket.orderId = undefined;
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        // Acknowledge to NATS
        msg.ack();
    }
}

module.exports = {
    OrderCreatedListener,
    OrderCancelledListener
}