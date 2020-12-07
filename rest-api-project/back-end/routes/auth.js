const express = require('express');
const router = express.Router();

const authController = require('./../controllers/auth');
const authValidation = require('./../validation/auth');

router.put('/signup', authValidation.signUp(), authController.signUp);

router.post('/login', authController.logIn);

module.exports = router;