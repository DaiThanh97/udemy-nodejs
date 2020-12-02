const ProductModel = require('./../models/product');

getProductForm = (req, res, next) => {
    let { productId } = req.params;
    if (productId) {
        ProductModel.findById(productId)
            .then(result => {
                res.render('admin/product-form', {
                    title: 'Admin Edit Product',
                    path: '/admin/product-form',
                    product: result,
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(err);
            });
    }
    else {
        res.render('admin/product-form', {
            title: 'Admin Add New Product',
            path: '/admin/product-form',
            product: {},
        });
    }
}

saveProduct = (req, res, next) => {
    const { _id: productId, ...product } = req.body;
    const image = req.file;
    if (!image) {
        return next(new Error('Image Invalid!'));
    }

    product.imageUrl = image.path;
    if (productId) {
        ProductModel.findByIdAndUpdate(productId, product)
            .lean()
            .then(result => {
                res.redirect('/admin/products');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(err);
            });
    }
    else {
        product.userId = req.session.user._id;
        const document = new ProductModel(product);
        document.save()
            .then(result => {
                res.redirect('/admin/products');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(err);
            });
    }
}

getProducts = (req, res, next) => {
    ProductModel.find({ userId: req.user._id })
        .lean()
        .then(result => {
            res.render('admin/products', {
                title: 'Admin Products',
                products: result,
                path: '/admin/products',
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
}

deleteProduct = (req, res, next) => {
    const { productId } = req.params;
    ProductModel.findByIdAndDelete(productId)
        .lean()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(err);
        });
}

module.exports = {
    getProductForm,
    saveProduct,
    getProducts,
    deleteProduct
}