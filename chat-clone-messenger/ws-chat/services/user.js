const jwt = require('jsonwebtoken');

const UserModel = require('./../models/User');
const Response = require('./../utils/response');
const CustomError = require('./../utils/customError');

exports.checkAuthen = (token) => {
    let decodeUser;
    try {
        decodeUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeUser) {
            throw new CustomError('Invalid Token!', 401);
        }

        // Check if user exists
        const { userId } = decodeUser;
        let user = await UserModel.findOne({ userId });
        if (user) {
            throw new CustomError('User not found!', 404);
        }

        return await UserModel.create({ userId, nick, avatar });
    }
    catch (err) {
        return err;
    }
}