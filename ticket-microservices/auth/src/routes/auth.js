const express = require('express');
const router = express.Router();

const { Validate, Handle } = require('./../validations/auth');
const { signUp, logIn, signOut, currentUser } = require('./../controllers/auth');

router.post('/logIn',
    Validate.logIn,
    Handle.logIn,
    logIn
);

router.post('/signUp',
    Validate.signUp,
    Handle.signUp,
    signUp
);

router.post('/signOut', signOut);

router.get('/currentUser', currentUser);

module.exports = router;