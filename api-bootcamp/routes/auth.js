const express = require('express');
const router = express.Router();

const { protect } = require('./../middlewares/auth');
const {
    register,
    login,
    getMyInfo
} = require('./../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMyInfo);

module.exports = router;