require('dotenv').config();
const jwt = require('jsonwebtoken');

const CustomError = require("../utils/CustomError");

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw CustomError.notAuthenticated('Not Authenticated!', null);
    }

    const token = authHeader.split(' ')[1];
    let data = '';
    try {
        data = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(error);
    }

    if (!data) {
        throw CustomError.notAuthenticated('Not Authenticated!', null);
    }

    req.userId = data._id;
    next();
}