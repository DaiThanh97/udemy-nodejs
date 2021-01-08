const { check } = require('express-validator');

const validate = {
    createPayment: [
        check('token')
            .notEmpty()
            .withMessage('Token is required!'),
        check('orderId')
            .notEmpty()
            .withMessage('orderId is required!')
    ],
}

module.exports = validate;