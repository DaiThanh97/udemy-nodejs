const { Publisher, Subject } = require('@tioticket/common');

class PaymentCreatedPublisher extends Publisher {
    subject = Subject.PaymentCreated;
}

module.exports = {
    PaymentCreatedPublisher
}