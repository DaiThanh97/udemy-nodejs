const { check } = require('express-validator');

const validate = {
    signUp: [
        check('email')
            .isEmail()
            .withMessage('Email must be vaild!'),
        check('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20!')
    ],
    logIn: [
        check('email')
            .isEmail().withMessage('Email must be valid!'),
        check('password')
            .notEmpty()
            .trim()
            .withMessage('Please enter a password!')
    ]
};

module.exports = validate;