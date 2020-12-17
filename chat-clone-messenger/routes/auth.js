const express = require('express');
const router = express.Router();

const asyncHandler = require('./../middlewares/async');
const multerConfig = require('./../configs/multer');
const auth = require('./../middlewares/auth');
const { validateRegister, validateLogin } = require('./../validators/auth');
const {
    register,
    logIn,
    requestFriend,
    acceptFriend,
    getListFriend,
    uploadAvatar
} = require('./../controllers/auth');

router.post('/register', validateRegister(), asyncHandler(register));
router.post('/login', validateLogin(), asyncHandler(logIn));
router.post('/request-friend', asyncHandler(auth), asyncHandler(requestFriend));
router.post('/accept-friend', asyncHandler(auth), asyncHandler(acceptFriend));
router.get('/friends', asyncHandler(auth), asyncHandler(getListFriend));
router.post('/upload-avatar', asyncHandler(auth), multerConfig.single('avatar'), asyncHandler(uploadAvatar));

module.exports = router;