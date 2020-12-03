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
router.get('/order', isAuth, shopController.getOrder);
router.get('/order/:orderId', isAuth, shopController.getInvoice);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);
router.get('/checkout/cancel', isAuth, shopController.getCheckout);
module.exports = router;
