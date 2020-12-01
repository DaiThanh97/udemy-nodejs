const crypto = require('crypto');

require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const UserModel = require('./../models/user');

// Init transporter for nodemailer
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: { api_key: process.env.MAIL_API_KEY }
}));

getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        title: 'Log In',
        errorMessage: req.flash('error')
    });
};

postLogin = (req, res, next) => {
    const { email, password } = req.body;
    const { errors } = validationResult(req);

    if (errors.length > 0) {
        return res.status(422).render('auth/login', {
            path: '/login',
            title: 'Log In',
            errorMessage: errors[0].msg
        });
    }

    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            // Check input pass against user pass
            bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        // use 'save' when redirect
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        title: 'Sign Up',
        errorMessage: ''
    });
};

postSignup = (req, res, next) => {
    const { email, password } = req.body;
    const { errors } = validationResult(req);

    if (errors.length > 0) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            title: 'Sign Up',
            errorMessage: errors[0].msg
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new UserModel({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: '15520811@gm.uit.edu.vn',
                subject: 'Sign Up Success',
                html: '<h1>You successfully signed up!</h1>'
            });
        })
        .catch(err => console.log(err));
}

postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        title: 'Reset Password',
        errorMessage: req.flash('error')
    })
}

postReset = (req, res, next) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        // Convert hex value to normal string 
        const token = buffer.toString('hex');
        UserModel.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with email found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + process.env.MAIL_EXPIRED;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                return transporter.sendMail({
                    to: email,
                    from: '15520811@gm.uit.edu.vn',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => console.log(err));
    })
}

getResetPassword = (req, res, next) => {
    const { token } = req.params;
    UserModel.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
    }).then(user => {
        res.render('auth/reset-password', {
            path: '/reset-password',
            title: 'Reset Password',
            errorMessage: '',
            userId: user._id.toString(),
            passwordToken: token
        });
    }).catch(err => console.log(err));
}

postResetPassword = (req, res, next) => {
    const { userId, password, passwordToken } = req.body;
    let resetUser = null;

    UserModel.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
    }).then(user => {
        resetUser = user;
        return bcrypt.hash(password, 12);
    }).then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = '';
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    }).then(result => {
        res.redirect('/login');
    }).catch(err => console.log(err));
}

module.exports = {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    postLogout,
    getReset,
    postReset,
    getResetPassword,
    postResetPassword
}