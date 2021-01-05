const Publisher = require('./base-publisher');

class TicketCreatedPublisher extends Publisher {
    subject = 'ticket:created';
}

module.exports = TicketCreatedPublisher;