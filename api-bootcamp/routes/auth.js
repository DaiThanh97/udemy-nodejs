const express = require('express');
const router = express.Router();

const asyncHandler = require('./../middlewares/async');
const {
    register,
    login
} = require('./../controllers/auth');

router.post('/register', asyncHandler(register));

router.post('/login', asyncHandler(login));

module.exports = router;