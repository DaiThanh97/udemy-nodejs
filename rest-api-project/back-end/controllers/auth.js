const { validationResult } = require('express-validator');
const bcypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserModel = require('./../models/user');

signUp = async (req, res, next) => {
    const { errors } = validationResult(req);
    try {
        if (errors.length > 0) {
            const error = new Error("Validation Failed!");
            error.status = 422;
            error.data = errors;
            throw error;
        }

        const { email, name, password } = req.body;
        const passwordHash = await bcypt.hash(password, 12);
        const user = new UserModel({
            email,
            name,
            password: passwordHash
        })
        const userDoc = await user.save();

        // Return response
        res.status(201).json({
            message: 'User created',
            userId: userDoc._id
        });
    } catch (err) {
        next(err);
    }
};

logIn = async (req, res, next) => {
    const { email, password } = req.body;
    let tempUser = null;
    try {
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            const error = new Error('No user found');
            error.status = 404;
            throw error;
        }
        tempUser = user;
        const isEqual = await bcypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password');
            error.status = 401;
            throw error;
        }
        // Generate JWT
        const token = jwt.sign({
            userId: tempUser._id.toString(),
            email: tempUser.email,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Return response
        res.status(200).json({
            message: 'Login success',
            token,
            userId: tempUser._id.toString()
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signUp,
    logIn
}