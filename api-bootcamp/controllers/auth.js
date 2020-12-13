const CustomError = require('./../utils/customError');
const UserModel = require('./../models/User');
const asyncHandler = require('./../middlewares/async');

//  @desc   Register user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.register = asyncHandler(async (req, res, next) => {
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
});

//  @desc   Login user
//  @route  POST /api/v1/auth/login
//  @access Public
exports.login = asyncHandler(async (req, res, next) => {
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

    res.status(200)
        .cookie('token', token, {
            maxAge: process.env.JWT_COOKIE_EXPIRE * 60 * 1000, // miliseconds
            httpOnly: true
        })
        .json({
            success: true,
            token
        });
});

//  @desc   Get current logged in user
//  @route  POST /api/v1/auth/me
//  @access Private
exports.getMyInfo = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).lean();

    res.status(200).json({
        success: true,
        data: user
    });
});