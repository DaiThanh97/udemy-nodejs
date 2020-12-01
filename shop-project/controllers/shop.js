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
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

module.exports = {
    getIndex,
    getProducts,
    getProduct,
    getCart,
    deleteCart,
    postOrder
}