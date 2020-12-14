const jwt = require('jsonwebtoken');

const CustomError = require('../utils/customError');
const UserModel = require('./../models/User');
const asyncHandler = require('./async');

// Protect route from unauthenticated
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        throw new CustomError('Not authorized!', 401);
    }

    const obj = jwt.verify(token, process.env.JWT_SECRET);
    if (!obj) {
        throw new CustomError('Not authorized!', 401);
    }

    const user = await UserModel.findById(obj.userId).lean();
    if (!user) {
        throw new CustomError('Not authorized!', 401);
    }

    req.user = user;
    next();
});

// Grand access to specific role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (!roles.includes(role)) {
            throw new CustomError(`Role ${role} is not nauthorized!`, 403);
        }
        next();
    }
}
