const { Listener, Subject } = require('@tioticket/common');
const Ticket = require('../../models/Ticket');

const queueGroupName = 'orders-service';

class TicketCreatedListener extends Listener {
    subject = Subject.TicketCreated;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const { id, title, price } = data;
        const ticket = new Ticket({ _id: id, title, price });
        await ticket.save(); // version 0
        msg.ack();
    }
}

class TicketUpdatedListener extends Listener {
    subject = Subject.TicketUpdated;
    queueGroupName = queueGroupName;

    onMessage = async (data, msg) => {
        const { id, version, title, price } = data;
        const ticket = await Ticket.findByEvent(id, version);
        if (!ticket) {
            throw new Error('Ticket not found!');
        }

        ticket.title = title;
        ticket.price = price;
        await ticket.save();
        msg.ack();
    }
}

module.exports = {
    TicketCreatedListener,
    TicketUpdatedListener
}