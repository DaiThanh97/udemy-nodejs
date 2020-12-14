const express = require('express');
const router = express.Router();

const { protect } = require('./../middlewares/auth');
const {
    register,
    login,
    getMyInfo,
    forgotPassword,
    resetPassword,
    Logout
} = require('./../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMyInfo);
router.get('/logout', Logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;