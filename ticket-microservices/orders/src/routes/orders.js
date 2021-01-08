const express = require('express');
const router = express.Router();

const { checkAuth, validateRequest } = require('@tioticket/common');
const { createOrder, getOrders, getOrder, updateOrder } = require('../controllers/orders');
const validate = require('../validations/orders');

router.post('/',
    checkAuth,
    validate.createOrder,
    validateRequest,
    createOrder
);

router.get('/',
    checkAuth,
    getOrders
);

router.route('/:id')
    .get(
        checkAuth,
        getOrder
    )
    .put(
        checkAuth,
        validate.updateOrder,
        validateRequest,
        updateOrder
    )
    .delete(
        checkAuth,
        validate.deleteOrder,
        validateRequest,
        updateOrder
    );

module.exports = router;