const express = require('express');
const router = express.Router();

const asyncMiddleware = require('./../middlewares/asyncMiddleware');
const userValidation = require('./../validations/user');
const userController = require('./../controllers/user');

router.get('/signUp', userValidation.validateSignUp(), asyncMiddleware(userController.signUp));
router.post('/logIn', userValidation.validateLogIn(), asyncMiddleware(userController.logIn));

module.exports = router;