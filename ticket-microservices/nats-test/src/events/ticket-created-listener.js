const Listener = require('./base-listener');

class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';
    onMessage = (data, msg) => {
        console.log('Event data: ', data);
        // Business logic
        msg.ack();
    }
}

module.exports = TicketCreatedListener;