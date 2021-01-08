const StatusCode = require('../configs/statusCode');

module.exports = (err, req, res, next) => {
    const { status, message, errors } = err;
    res.status(status || StatusCode.INTERNAL_ERROR).json({
        message,
        errors: errors ? errors : {}
    });
};