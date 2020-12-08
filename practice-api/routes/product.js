const express = require('express');
const router = express.Router();

const checkAuth = require('./../middlewares/checkAuth');
const productController = require('./../controllers/product');

router.post('/get-product', checkAuth, productController.getProduct);

module.exports = router;