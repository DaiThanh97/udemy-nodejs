
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const UserModel = require('./../models/user');
const CustomError = require('./../utils/CustomError');

// signUp = async (req, res, next) => {
//     const { errors } = validationResult(req);
//     if (errors.length > 0) {
//         return next(CustomError.badRequest('Validation failed', errors));
//     }

//     const { username, password } = req.body;
//     try {
//         const passwordHash = await bcrypt.hash(password, 12);
//         const user = new UserModel({
//             username,
//             password: passwordHash
//         });
//         const result = await user.save();

//         // return response
//         res.status(201).json({
//             message: 'Sign up success!',
//             user: result
//         });
//     }
//     catch (error) {
//         next(error);
//     }
// }

// logIn = async (req, res, next) => {
//     const { errors } = validationResult(req);
//     if (errors.length > 0) {
//         return next(CustomError.badRequest('Validation failed!', errors));
//     }

//     const { username, password } = req.body;
//     try {
//         const user = await UserModel.findOne({ username }).lean();
//         if (!user) {
//             throw CustomError.notFound('User not found!', null);
//         }

//         const checkPassword = await bcrypt.compare(password, user.password);
//         if (!checkPassword) {
//             throw CustomError.notAuthenticated('Wrond password!', null);
//         }

//         // gen token
//         const token = jwt.sign({
//             userId: user._id.toString()
//         }, process.env.JWT_SECRET, {
//             expiresIn: '1h'
//         });

//         // return response
//         res.status(200).json({
//             message: 'Login success!',
//             token,
//             userId: user._id.toString()
//         });
//     }
//     catch (error) {
//         next(error);
//     }
// }

// logIn = (req, res, next) => {
//     const { errors } = validationResult(req);
//     if (errors.length > 0) {
//         throw CustomError.badRequest('Validation failed!', errors);
//     }

//     const { username, password } = req.body;
//     UserModel.findOne({ username }).lean()
//         .then(user => {
//             if (!user) {
//                 throw CustomError.notFound('User not found!', null);
//             }
//             return bcrypt.compare(password, user.password);
//         })
//         .then(isEqual => {
//             if (!isEqual) {
//                 throw CustomError.notAuthenticated('Wrond password!', null);
//             }

//             // gen token
//             const token = jwt.sign({
//                 userId: user._id.toString()
//             }, process.env.JWT_SECRET, {
//                 expiresIn: '1h'
//             });

//             // return response
//             res.status(200).json({
//                 message: 'Login success!',
//                 token,
//                 userId: user._id.toString()
//             });
//         })
//         .catch(err => next(err));
// }


signUp = async (req, res, next) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        throw CustomError.badRequest('Validation failed', errors);
    }

    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = new UserModel({
        username,
        password: passwordHash
    });
    const result = await user.save();

    // return response
    res.status(201).json({
        message: 'Sign up success!',
        user: result
    });
}

logIn = async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
        throw CustomError.badRequest('Validation failed!', errors);
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).lean();
    if (!user) {
        throw CustomError.notFound('User not found!', null);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        throw CustomError.notAuthenticated('Wrond password!', null);
    }

    // gen token
    const token = jwt.sign({
        userId: user._id.toString()
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    // return response
    res.status(200).json({
        message: 'Login success!',
        token,
        userId: user._id.toString()
    });
}

module.exports = {
    signUp,
    logIn
}