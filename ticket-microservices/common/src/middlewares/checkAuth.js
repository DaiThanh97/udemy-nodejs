const jwt = require('jsonwebtoken');

const StatusCode = require('./../configs/statusCode');

module.exports = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            throw new Error('Not authenticated!');
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        if (!payload) {
            throw new Error('Not authenticated!');
        }
        req.currentUser = payload;
        next();
    }
    catch (err) {
        err.message = 'Not authenticated!';
        err.status = StatusCode.UNAUTHENTICATED;
        next(err);
    }
};