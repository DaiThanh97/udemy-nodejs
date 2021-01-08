const { Publisher, Subject } = require('@tioticket/common');

class ExpirationCompletePublisher extends Publisher {
    subject = Subject.ExpirationComplete
}

module.exports = {
    ExpirationCompletePublisher
}