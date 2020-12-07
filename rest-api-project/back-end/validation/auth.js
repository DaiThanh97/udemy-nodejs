const { check } = require('express-validator');

const UserModel = require('./../models/user');

signUp = () => {
    return [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return UserModel.findOne({ email: value }).then(user => {
                    if (user) {
                        return Promise.reject('Email already exists!');
                    }
                })
            })
            .normalizeEmail(),
        check('password')
            .trim()
            .isLength({ min: 5 }),
        check('name')
            .trim()
            .notEmpty()
    ];
}

module.exports = {
    signUp
}