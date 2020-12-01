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
            .catch(err => console.log(err));
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
    if (productId) {
        ProductModel.findByIdAndUpdate(productId, product)
            .lean()
            .then(result => {
                res.redirect('/admin/products');
            })
            .catch(err => console.log(err));
    }
    else {
        product.userId = req.session.user._id;
        const document = new ProductModel(product);
        document.save()
            .then(result => {
                res.redirect('/admin/products');
            })
            .catch(err => console.log(err));
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
        .catch(err => console.log(err));
}

deleteProduct = (req, res, next) => {
    const { productId } = req.params;
    ProductModel.findByIdAndDelete(productId)
        .lean()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

module.exports = {
    getProductForm,
    saveProduct,
    getProducts,
    deleteProduct
}