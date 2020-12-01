const express = require('express');
const router = express.Router();

const authValidation = require('./../validations/auth');
const authController = require('./../controllers/auth');

router.get('/login', authController.getLogin);
router.post('/login', authValidation.validateLogIn(), authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authValidation.validateSignUp(), authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

module.exports = router;