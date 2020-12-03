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
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/order', isAuth, shopController.getOrder);
router.get('/order/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
