const jwt = require('jsonwebtoken');

exports.sign = data => {
    return jwt.sign(data, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

exports.verify = token => {
    return jwt.verify(token, process.env.JWT_KEY);
}