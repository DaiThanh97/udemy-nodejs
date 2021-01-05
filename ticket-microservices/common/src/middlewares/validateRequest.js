const { validationResult } = require('express-validator');

const StatusCode = require('./../configs/statusCode');
const { CustomError } = require('./../utils/response');

module.exports = (req, res, next) => {
    let { errors } = validationResult(req);
    if (errors.length > 0) {
        errors = errors.map(err => ({ message: err.msg, field: err.param }));
        const customErr = new CustomError(StatusCode.BAD_REQUEST, 'Invalid input!', errors);
        return next(customErr);
    }
    next();
}