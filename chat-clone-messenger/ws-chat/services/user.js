const UserModel = require('./../models/User');

exports.getUser = async ({ userId, nick, avatar }) => {
    try {
        // Check if user exists
        let user = await UserModel.findOne({ userId });
        // console.log("USERRR: ", user);
        if (user) {
            return user;
        }

        user = await UserModel.create({ userId, nick, avatar });
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
};