const asyncHandler = require('./../middlewares/async');
const StatusCode = require('../configs/statusCode');
const { CustomError, Response } = require('../utils/response');
const UserModel = require('./../models/User');
const jwtService = require('./../services/jwt');
const passwordService = require('./../services/password');
const JwtCookie = require('./../configs/cookie');

// @desc    Sign up user
// @route   POST /api/users/signUp
// @access  Public
exports.signUp = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
        throw new CustomError(StatusCode.BAD_REQUEST, 'Email is already in use!');
    }

    // Handle
    const passwordHashed = await passwordService.hash(password);
    user = new UserModel({ email, password: passwordHashed });
    await user.save();

    // Response
    res.status(StatusCode.CREATED)
        .json(new Response('SignUp success!', user));
});

// @desc    Log in user
// @route   POST /api/users/logIn
// @access  Public
exports.logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new CustomError(StatusCode.BAD_REQUEST, 'Invalid credentials!');
    }

    // Handle
    const checkPassword = await passwordService.check(password, user.password);
    if (!checkPassword) {
        throw new CustomError(StatusCode.BAD_REQUEST, 'Invalid credentials!');
    }

    // Generate JWT
    const token = jwtService.sign({
        id: user.id,
        email: user.email
    });

    // Response
    res.status(StatusCode.SUCCESS)
        .cookie(JwtCookie.key, token, JwtCookie.optionLogIn)
        .json(new Response('Login success!', user));
});

// @desc    Sign out user
// @route   POST /api/users/signOut
// @access  Private
exports.signOut = asyncHandler(async (req, res, next) => {
    res.status(StatusCode.SUCCESS)
        .cookie(JwtCookie.key, null, JwtCookie.optionLogOut)
        .json(new Response('Logout success!'));
});

// @desc    Get current user
// @route   GET /api/users/currentUser
// @access  Public
exports.currentUser = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new CustomError(StatusCode.UNAUTHENTICATED, 'Not authenticated!');
    }

    const payload = jwtService.verify(token);
    req.currentUser = payload;
    res.status(StatusCode.SUCCESS).json(new Response('Success', payload));
});