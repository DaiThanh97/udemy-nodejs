const express = require('express');
const router = express.Router();

const { validateRequest, checkAuth } = require('@tioticket/common');
const validate = require('./../validations/payment');
const { createPayment } = require('./../controllers/payment');

router.post('/',
    checkAuth,
    validate.createPayment,
    validateRequest,
    createPayment
);

module.exports = router;