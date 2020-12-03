const { body } = require('express-validator');

const UserModel = require('./../models/user');

validateSignUp = () => {
    return [
        body('email')
            .notEmpty().withMessage('Please fill in email!')
            .isEmail().withMessage('Please enter a valid email!')
            .custom((value, { req }) => {
                return UserModel.findOne({ email: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Email exists already! Please choose another email');
                        }
                    });
            })
            .normalizeEmail(),
        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
            .notEmpty()
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, { req }) => {
                return value === req.body.password;
            }).withMessage('Have to match')
            .trim()
    ];
}

validateLogIn = () => {
    return [
        body('email')
            .notEmpty().withMessage('Please fill in email!')
            .isEmail().withMessage('Please fill in valid email!')
            .normalizeEmail(),
        body('password', 'Please enter a password with only numbers and text and at least 5 characters')
            .notEmpty()
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ];
}

module.exports = {
    validateSignUp,
    validateLogIn
}