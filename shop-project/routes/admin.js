const express = require('express');
const router = express.Router();

const adminController = require('./../controllers/admin');
const isAuth = require('./../middleware/is-auth');

router.get('/product-form(/:productId)?', isAuth, adminController.getProductForm);
router.post('/save', isAuth, adminController.saveProduct);
router.get('/products', isAuth, adminController.getProducts);
router.get('/delete/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
