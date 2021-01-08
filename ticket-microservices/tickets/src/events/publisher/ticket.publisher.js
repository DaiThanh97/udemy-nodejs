const { Publisher, Subject } = require('@tioticket/common');

class TicketCreatedPublisher extends Publisher {
    subject = Subject.TicketCreated;
}

class TicketUpdatedPublisher extends Publisher {
    subject = Subject.TicketUpdated;
}

module.exports = {
    TicketCreatedPublisher,
    TicketUpdatedPublisher
};