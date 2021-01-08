const { Publisher, Subject } = require('@tioticket/common');

class OrderCreatedPublisher extends Publisher {
    subject = Subject.OrderCreated
}

class OrderCancelledPublisher extends Publisher {
    subject = Subject.OrderCancelled;
}

module.exports = {
    OrderCreatedPublisher,
    OrderCancelledPublisher
}