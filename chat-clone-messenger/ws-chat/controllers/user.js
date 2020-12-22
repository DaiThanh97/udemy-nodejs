const jwt = require('jsonwebtoken');

const UserModel = require('./../models/User');
const CustomError = require('./../utils/customError');

exports.checkAuthen = async token => {
    let decodeUser;
    try {
        decodeUser = jwt.verify(token, process.env.JWT_SECRET);
        // Check if user exists
        const { nick, avatar, userId } = decodeUser;
        let user = await UserModel.findOne({ userId });
        if (user) {
            return user;
        }
        return await UserModel.create({ userId, nick, avatar });
    }
    catch (err) {
        throw new CustomError('Invalid Token!', 401);
    }
}