const { check } = require('express-validator');

const UserModel = require('./../models/user');

validateSignUp = () => {
    return [
        check('username', 'Username is invalid!')
            .isLength({ min: 6, max: 15 })
            .trim()
            .custom((value, { req }) => {
                return UserModel.findOne({ username: value })
                    .then(user => {
                        if (user) {
                            return Promise.reject('Username is already existed!');
                        }
                    });
            }),
        check('password', 'Password is invalid!')
            .isLength({ min: 6, max: 15 })
            .trim(),
        check('confirmPassword', 'Password not match!')
            .custom((value, { req }) => {
                return value === req.body.password;
            })
    ];
};

validateLogIn = () => {
    return [
        check('username', 'Username is invalid!')
            .isLength({ min: 6, max: 15 })
            .trim(),
        check('password', 'Password is invalid!')
            .isLength({ min: 6, max: 15 })
            .trim()
    ];
};

module.exports = {
    validateSignUp,
    validateLogIn
}