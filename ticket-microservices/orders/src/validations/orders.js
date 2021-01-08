const { check } = require('express-validator');

const validate = {
    createOrder: [
        check('ticketId')
            .notEmpty()
            .withMessage('TicketId is required!'),
    ],
    updateOrder: [
        check('title')
            .notEmpty()
            .withMessage('Title is required!'),
    ],
    deleteOrder: [
        check('title')
            .notEmpty()
            .withMessage('Title is required!'),
    ]
}

module.exports = validate;