const express = require('express');
const router = express.Router();

const validate = require('./../validations/auth');
const { signUp, logIn, signOut, currentUser } = require('./../controllers/auth');
const { validateRequest } = require('@tioticket/common');

router.post('/logIn',
    validate.logIn,
    validateRequest,
    logIn
);

router.post('/signUp',
    validate.signUp,
    validateRequest,
    signUp
);

router.post('/signOut', signOut);

router.get('/currentUser', currentUser);

module.exports = router;