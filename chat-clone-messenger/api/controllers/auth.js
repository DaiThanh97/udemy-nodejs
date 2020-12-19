const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/User');
const FriendModel = require('../models/Friend');
const CustomError = require('./../utils/customError');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  @Public
exports.register = async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        let errs = errors.map(err => err.msg);
        throw new CustomError(errs, 400);
    }

    // Handling after validations
    const { email, password, nick } = req.body;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        email,
        password: hashedPassword,
        nick
    });

    //
    await FriendModel.create({
        userId: user.id
    });

    // Return response
    res.status(200).json({
        success: true,
        message: 'Register successfully!'
    });
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  @Public
exports.logIn = async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        let errs = errors.map(err => err.msg);
        throw new CustomError(errs, 400);
    }

    // Handling after validations
    const { email } = req.body;
    const user = await UserModel.findOne({ email }).lean();

    // Gen jwt token
    const token = jwt.sign({
        userId: user._id,
        nick: user.nick,
        avatar: user.avatar
    }, process.env.JWT_SECRET, {});

    // Return response
    res.status(200)
        .cookie('token', token, {
            maxAge: process.env.JWT_COOKIE_MAXAGE * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        .json({
            success: true,
            message: 'Login successfully!',
            token
        });
};

// @desc    Add friend
// @route   POST /api/v1/auth/request-friend
// @access  @Private
exports.requestFriend = async (req, res, next) => {
    const { friendId } = req.body;
    const userFriend = await FriendModel.findOne({ userId: friendId });
    if (!userFriend) {
        throw new CustomError('Friend not found!', 404);
    }

    await userFriend.addPendingFriend(req.user.id);

    // Return response
    res.status(200).json({
        success: true,
        message: 'Request add friend successfully!'
    });
};

// @desc    Accept friend
// @route   POST /api/v1/auth/accept-friend
// @access  @Private
exports.acceptFriend = async (req, res, next) => {
    const { requestId } = req.body;
    const reqAddUser = await FriendModel.findOne({ userId: requestId });
    if (!reqAddUser) {
        throw new CustomError('Friend not found!', 404);
    }

    reqAddUser.addFriend(req.user.id);

    const me = await FriendModel.findOne({ userId: req.user.id });
    await me.addFriend(reqAddUser.userId.toString());

    // Return response
    res.status(200).json({
        success: true,
        message: 'Accept friend successfully!',
    });
};

// @desc    Get List Friend
// @route   GET /api/v1/auth/friends
// @access  @Private
exports.getListFriend = async (req, res, next) => {
    // Get friends
    let { friends } = await FriendModel.findOne({ userId: req.user.id }, '-_id friends').populate('friends.friendId').lean();
    friends = friends.map(fr => {
        return fr.friendId;
    })

    // Return response
    res.status(200).json({
        success: true,
        message: 'Get list friend successfully!',
        friends
    });
};

// @desc    Upload Avatar
// @route   GET /api/v1/auth/upload-avatar
// @access  @Private
exports.uploadAvatar = async (req, res, next) => {
    const avatar = req.file;
    if (!avatar) {
        throw new CustomError('Avatar Invalid!');
    }

    // product.imageUrl = avatar.path;
    await UserModel.findByIdAndUpdate(req.user.id, {
        avatar: avatar.path
    });

    // Return response
    res.status(200).json({
        success: true,
        message: 'Upload avatar successfully!',
    });
};