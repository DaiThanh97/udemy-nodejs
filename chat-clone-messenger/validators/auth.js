const { check } = require('express-validator');
const bcrypt = require('bcryptjs');

const UserModel = require('../models/User');
const CustomError = require('./../utils/customError');

exports.validateRegister = () => {
    return [
        check('email')
            .isEmail().withMessage('Please enter a valid email!')
            .custom(async (value, { req }) => {
                const user = await UserModel.findOne({ email: value }).lean();
                if (user) {
                    throw new CustomError('Email is already existed!', 400);
                }
            }),
        check('password')
            .isLength({ min: 6, max: 15 }).withMessage('Password must between 6 and 15 characters!')
            .trim(),
        check('nick')
            .notEmpty().withMessage('Please enter nick name!')
            .trim()
    ];
}

exports.validateLogin = () => {
    return [
        check('email')
            .isEmail().withMessage('Please enter a valid email!'),
        check('password')
            .isLength({ min: 6, max: 15 }).withMessage('Password must between 6 and 15 characters!')
            .trim()
            .custom(async (value, { req }) => {
                const { email } = req.body;
                const user = await UserModel.findOne({ email }).lean();
                if (!user) {
                    throw new CustomError('Invalid credentials!', 400);
                }

                // If exists user with email then check password
                const isMatchPassword = await bcrypt.compare(value, user.password);
                if (!isMatchPassword) {
                    throw new CustomError('Invalid credentials!', 400);
                }
            })
    ];
}