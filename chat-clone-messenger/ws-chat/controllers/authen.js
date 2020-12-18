const jwt = require('jsonwebtoken');

exports.checkAuthen = async (token) => {
    try {
        const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodeUser) {
            throw new Error('User not found');
        }

        // Check if user exists
        const user = await UserModel.findById(decodeUser.userId);
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
};