const CustomError = require('./../utils/customError');
const UserModel = require('./../models/User');
const asyncHandler = require('./../middlewares/async');
const sendEmail = require('./../utils/sendEmail');
const User = require('./../models/User');

//  @desc   Register user
//  @route  POST /api/v1/auth/register
//  @access Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    await UserModel.create({
        name,
        email,
        password,
        role
    });

    res.status(200).json({
        success: true
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
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
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
    // const user = await UserModel.findById(req.user._id).lean();

    res.status(200).json({
        success: true,
        data: req.user
    });
});

//  @desc   Forgot password
//  @route  POST /api/v1/auth/forgotpassword
//  @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new CustomError('No user with that email!', 404);
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({
            success: true
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new CustomError('Email could not be sent!', 500));
    }
});

//  @desc   Reset password
//  @route  PUT /api/v1/auth/resetpassword/:resetToken
//  @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { resetToken } = req.params;

    const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        throw new CustomError('Invalid token!', 400);
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
    });
});

//  @desc   Log out
//  @route  GET /api/v1/auth/logout
//  @access Private
exports.Logout = asyncHandler(async (req, res, next) => {
    res.status(200)
        .cookie('token', null, {
            expries: new Date(Date.now() + 5 * 1000),
            httpOnly: true
        })
        .json({
            success: true,
        });
});