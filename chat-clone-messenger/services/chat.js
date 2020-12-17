const jwt = require('jsonwebtoken');

const socketio = require('./../utils/socketio');
const CustomError = require('./../utils/customError');

exports.loginChat = (token) => {
    let decodeData;
    try {
        decodeData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return new CustomError('Token is expired!');
    }

    if (!decodeData) {
        return new CustomError('No Authenticated!');
    }

    return 'Login success';
}