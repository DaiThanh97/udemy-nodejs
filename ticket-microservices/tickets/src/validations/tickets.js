const { check } = require('express-validator');

const validate = {
    createTicket: [
        check('title')
            .notEmpty()
            .withMessage('Title is required!'),
        check('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0!')
    ],
    updateTicket: [
        check('title')
            .notEmpty()
            .withMessage('Title is required!'),
        check('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0!')
    ]
}

module.exports = validate;