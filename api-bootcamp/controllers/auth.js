const CustomError = require('./../utils/customError');
const UserModel = require('./../models/User');

//  @desc   Register user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.register = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await UserModel.create({
        name,
        email,
        password,
        role
    });

    res.status(200).json({
        success: true,
        token
    });
};

//  @desc   Login user
//  @route  POST /api/v1/auth/login
//  @access Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
        throw new CustomError('Invalid credentials!', 401);
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
        throw new CustomError('Invalid credentials!', 401);
    }

    // Create Token
    const token = user.getSignedJWT();

    res.status(200).json({
        success: true,
        token
    });
};