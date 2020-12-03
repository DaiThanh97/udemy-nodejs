require('dotenv').config();
const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ProductModel = require('./../models/product');
const OrderModel = require('./../models/order');

getIndex = (req, res, next) => {
    ProductModel.find()
        .lean()
        .then(result => {
            res.render('shop/index', {
                title: 'Shop',
                products: result,
                path: '/',
            });
        })
        .catch(err => console.log(err));
}

getProducts = (req, res, next) => {
    ProductModel.find()
        .lean()
        .then(result => {
            res.render('shop/product-list', {
                title: 'List Products',
                products: result,
                path: '/products',

            });
        })
        .catch(err => console.log(err));
}

getProduct = (req, res, next) => {
    const { productId } = req.params;
    ProductModel.findById(productId)
        .lean()
        .then(result => {
            res.render('shop/product-detail', {
                title: 'Product Detail',
                product: result,
                path: '/products',
            });
        })
        .catch(err => console.log(err));
}

getCart = (req, res, next) => {
    const { productId } = req.params;
    if (productId) {
        ProductModel.findById(productId)
            .lean()
            .then(result => {
                return req.user.addToCart(result);
            })
            .then(result => {
                res.redirect('/cart');
            })
            .catch(err => console.log(err));
    }
    else {
        req.user
            .populate('cart.items.productId')
            .execPopulate()
            .then(result => {
                const { items } = result.cart;
                res.render('shop/cart', {
                    items,
                    title: 'Your Cart',
                    path: '/cart',
                })
            })
            .catch(err => console.log(err));
    }
}

deleteCart = (req, res, next) => {
    const { productId } = req.params;
    req.user.deleteCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(result => {
            const products = result.cart.items.map(item => {
                return {
                    quantity: item.quantity,
                    product: item.productId._doc
                };
            });
            const order = new OrderModel({
                user: {
                    email: req.session.user.email,
                    userId: req.session.user._id
                },
                products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
}

getOrder = (req, res, next) => {
    OrderModel.find({ 'user.userId': req.user._id }, { user: 0 })
        .lean()
        .then(result => {
            res.render('shop/order', {
                path: '/order',
                title: 'Orders',
                orders: result
            })
        })
        .catch(err => console.log(err));
}

getInvoice = (req, res, next) => {
    const { orderId } = req.params;

    OrderModel.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found!'));
            }

            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized!!!'));
            }

            const invoiceName = `invoice-${orderId}.txt`;
            const invoicePath = path.join('private', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Disposition', `attachment; filename=${invoiceName}`);
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.text('Hello World');
            pdfDoc.end();

            // const file = fs.createReadStream(invoicePath);
            // file.pipe(res);
        })
        .catch(err => next(err));
}

getCheckout = (req, res, next) => {
    let items = [];
    let total = 0;

    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(result => {
            items = result.cart.items;
            total = items.reduce((total, item, index) => {
                return total += item.quantity * item.productId.price;
            }, 0);

            // Create checkout session
            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: items.map(item => {
                    const { productId, quantity } = item;
                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: productId.title,
                            },
                            unit_amount: productId.price * 100,
                        },
                        quantity: quantity,
                        description: productId.description
                    }
                }),
                mode: 'payment',
                success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
                cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
            });
        })
        .then(session => {
            res.render('shop/checkout', {
                title: 'Checkout',
                path: '/checkout',
                items,
                total,
                sessionId: session.id
            })
        })
        .catch(err => console.log(err));
}

getCheckoutSuccess = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(result => {
            const products = result.cart.items.map(item => {
                return {
                    quantity: item.quantity,
                    product: item.productId._doc
                };
            });
            const order = new OrderModel({
                user: {
                    email: req.session.user.email,
                    userId: req.session.user._id
                },
                products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
}

module.exports = {
    getIndex,
    getProducts,
    getProduct,
    getCart,
    deleteCart,
    postOrder,
    getOrder,
    getInvoice,
    getCheckout,
    getCheckoutSuccess
}