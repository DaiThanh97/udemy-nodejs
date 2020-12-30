const StatusCode = require('../configs/statusCode');

exports.errorHandler = (err, req, res, next) => {
    const { status, message, errors } = err;
    res.status(status || StatusCode.INTERNAL_ERROR).json({
        message,
        errors
    });
};