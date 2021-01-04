const express = require('express');
const router = express.Router();

const { checkAuth, validateRequest } = require('@tioticket/common');
const { createTicket, getTickets, getTicket, updateTicket } = require('./../controllers/tickets');
const validate = require('./../validations/tickets');

router.post('/',
    checkAuth,
    validate.createTicket,
    validateRequest,
    createTicket
);

router.get('/', getTickets);

router.route('/:id')
    .get(getTicket)
    .put(checkAuth,
        validate.updateTicket,
        validateRequest,
        updateTicket
    );

module.exports = router;