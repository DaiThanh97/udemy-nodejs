const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const CustomError = require('./../utils/customError');

module.exports = async (req, res, next) => {
    // Get token from cookie
    const token = req.cookies.token;
    if (!token) {
        throw new CustomError('No Authenticated!', 401);
    }

    // Verify token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
        throw new CustomError('No Authenticated!', 401);
    }

    // Check if user exists
    const user = await UserModel.findById(data.userId);
    if (!user) {
        throw new CustomError('No Authenticated!', 401);
    }

    // If exists user
    req.user = user;
    next();
}