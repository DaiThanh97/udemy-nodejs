const jwt = require('jsonwebtoken');

const CustomError = require('../utils/customError');
const UserModel = require('./../models/User');
const asyncHandler = require('./async');

exports.protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new CustomError('Not authorized!', 401);
    }

    const token = authHeader.split(' ')[1];
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