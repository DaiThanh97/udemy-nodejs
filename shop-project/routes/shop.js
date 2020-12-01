const express = require('express');
const router = express.Router();

const shopController = require('./../controllers/shop');
const isAuth = require('./../middleware/is-auth');

/* GET home page. */
router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart(/:productId)?', isAuth, shopController.getCart);
router.get('/delete-cart/:productId', isAuth, shopController.deleteCart);
router.post('/order', isAuth, shopController.postOrder);

module.exports = router;
