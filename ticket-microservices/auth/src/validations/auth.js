const { check, validationResult } = require('express-validator');

const { CustomError } = require('../utils/response');
const StatusCode = require('../configs/statusCode');

const Validate = {
    signUp: [
        check('email')
            .isEmail().withMessage('Email must be vaild!'),
        check('password')
            .trim()
            .isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20!')
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

const Handle = {
    signUp: (req, res, next) => {
        let { errors } = validationResult(req);
        if (errors.length > 0) {
            errors = errors.map(err => ({ message: err.msg, field: err.param }));
            throw new CustomError(StatusCode.BAD_REQUEST, 'Invalid input!', errors);
        }
        next();
    },
    logIn: (req, res, next) => {
        let { errors } = validationResult(req);
        if (errors.length > 0) {
            errors = errors.map(err => ({ message: err.msg, field: err.param }));
            throw new CustomError(StatusCode.BAD_REQUEST, 'Invalid input!', errors);
        }
        next();
    }
}

module.exports = {
    Validate,
    Handle
}